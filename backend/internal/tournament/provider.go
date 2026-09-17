package tournament

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/google/uuid"
)

var spaceCollapser = regexp.MustCompile(`\s+`)

var (
	ROUND_LINK   = regexp.MustCompile(`[?&]art=2(?:&|$)`)
	ROUND_NUMBER = regexp.MustCompile(`[?&]rd=(\d+)`)
	TOTAL_ROUNDS = regexp.MustCompile(`\/\s*(\d+)\s*$`)
)

var searchUrl = "https://s1.chess-results.com/TurnierSuche.aspx"

type Provider interface {
	GetTournament(url string) (*Tournament, error)
	SearchTournaments(query string) (*[]TournamentView, error)
}

type provider struct {
	httpClient *http.Client
}

func NewProvider() Provider {
	return &provider{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type roundLink struct {
	Round int
	Label string
}

func (p *provider) GetTournament(url string) (*Tournament, error) {
	pageURL, err := tournamentPageURL(url)

	if err != nil {
		return nil, err
	}

	response, err := p.httpClient.Get(pageURL)

	if err != nil {
		return nil, err
	}

	doc, err := goquery.NewDocumentFromReader(response.Body)

	response.Body.Close()

	if err != nil {
		return nil, err
	}

	heading := doc.Find("h2").First()
	if heading.Length() == 0 {
		return nil, errors.New(
			"No <h2> on the page: not a tournament page, or the layout changed",
		)
	}

	name := strings.TrimSpace(spaceCollapser.ReplaceAllString(heading.Text(), " "))

	links := extractRoundLinks(doc)
	
	// No round links at all means no pairings have been published yet, which
	// is a normal state for a tournament that has not started.
	currentRound := 0
	for _, link := range links {
		if link.Round > currentRound {
			currentRound = link.Round
		}
	}

	total := numberOfRounds(doc)
	if total == 0 {
		total = totalRounds(links, currentRound)
	}

	_ = doc

	return &Tournament{
		ID: uuid.NewString(),
		URL: url,
		Name: name,
		CurrentRound: currentRound,
		TotalRounds: total,
		LastCheckedAt: time.Now(),
	}, nil
}

func (p *provider) SearchTournaments(query string) (*[]TournamentView, error) {
	response, err := p.httpClient.Get(searchUrl)

	if err != nil {
		return nil, err
	}

	form, err := goquery.NewDocumentFromReader(response.Body)

	response.Body.Close()

	if err != nil {
		return nil, err
	}

	values := url.Values{}

	form.Find("form#form1 input[type=hidden]").Each(func(_ int, input *goquery.Selection) {
		name, _ := input.Attr("name")
		value, _ := input.Attr("value")
		values.Set(name, value)
	})

	if values.Get("__VIEWSTATE") == "" {
		return nil, errors.New(
			"No __VIEWSTATE on the search page: the layout changed",
		)
	}

	values.Set("ctl00$P1$txt_bez", query)
	values.Set("ctl00$P1$combo_art", "5")           // All tournaments
	values.Set("ctl00$P1$combo_sort", "1")          // Last update
	values.Set("ctl00$P1$combo_land", "-")          // Any federation
	values.Set("ctl00$P1$combo_bedenkzeit", "0")    // Any time control
	values.Set("ctl00$P1$combo_anzahl_zeilen", "0") // 100 rows
	values.Set("ctl00$P1$cb_suchen", "Search")

	response, err = p.httpClient.PostForm(searchUrl, values)

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Search request failed with status %d", response.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(response.Body)

	if err != nil {
		return nil, err
	}

	tournaments := extractSearchResults(doc, response.Request.URL)

	return &tournaments, nil
}

// tournamentPageURL returns the URL to scrape for a tournament: forced to
// English, since the details labels are localized, and with the tournament
// details expanded, since they are otherwise hidden on most pages.
func tournamentPageURL(raw string) (string, error) {
	parsed, err := url.Parse(raw)
	if err != nil {
		return "", err
	}

	query := parsed.Query()
	query.Set("lan", "1")
	query.Set("turdet", "YES")
	parsed.RawQuery = query.Encode()

	return parsed.String(), nil
}

// numberOfRounds reads the "Number of rounds" row of the tournament details.
// It returns 0 when the row is missing.
func numberOfRounds(doc *goquery.Document) int {
	total := 0

	doc.Find("tr").EachWithBreak(func(_ int, row *goquery.Selection) bool {
		cells := row.Children()
		if cells.Length() != 2 || strings.TrimSpace(cells.First().Text()) != "Number of rounds" {
			return true
		}

		if n, err := strconv.Atoi(strings.TrimSpace(cells.Last().Text())); err == nil {
			total = n
		}
		return false
	})

	return total
}

func extractRoundLinks(doc *goquery.Document) []roundLink {
	var links []roundLink

	doc.Find("a").Each(func(_ int, anchor *goquery.Selection) {
		href, exists := anchor.Attr("href")
		if !exists {
			href = ""
		}
		label := anchor.Text()

		if !ROUND_LINK.MatchString(href) {
			return
		}

		round := 0
		if m := ROUND_NUMBER.FindStringSubmatch(href); len(m) > 1 {
			if n, err := strconv.Atoi(m[1]); err == nil {
				round = n
			}
		}

		if round > 0 {
			links = append(links, roundLink{Round: round, Label: label})
		}
	})

	return links
}

// extractSearchResults reads the results table. A search without matches
// renders no table at all, which yields an empty list.
func extractSearchResults(doc *goquery.Document, base *url.URL) []TournamentView {
	tournaments := make([]TournamentView, 0)

	// The header row has no tournament link, so it is skipped naturally.
	doc.Find("table.CRs2 tr").Each(func(_ int, row *goquery.Selection) {
		anchor := row.Find("td a[href]").First()

		href, exists := anchor.Attr("href")
		if !exists {
			return
		}

		link, err := base.Parse(href)
		if err != nil {
			return
		}

		name := strings.TrimSpace(spaceCollapser.ReplaceAllString(anchor.Text(), " "))

		tournaments = append(tournaments, TournamentView{
			TournamentURL:  link.String(),
			TournamentName: name,
		})
	})

	return tournaments
}

func totalRounds(links []roundLink, currentRound int) int {
	var latestLabel string
	for _, link := range links {
		if link.Round == currentRound {
			latestLabel = link.Label
			break
		}
	}

	// Only the latest round's label carries the total. Without it the best
	// available answer is the round we can see.
	m := TOTAL_ROUNDS.FindStringSubmatch(strings.TrimSpace(latestLabel))
	if len(m) < 2 {
		return currentRound
	}

	n, err := strconv.Atoi(m[1])
	if err != nil {
		return currentRound
	}
	return n
}