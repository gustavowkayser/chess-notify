package chess

import (
	"chess-notify/internal/tournament"
	"errors"
	"net/http"
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

type Provider interface {
	GetTournament(url string) (*tournament.Tournament, error)
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

func (p *provider) GetTournament(url string) (*tournament.Tournament, error) {

	response, err := p.httpClient.Get(url)

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

	total := totalRounds(links, currentRound)
	
	_ = doc

	return &tournament.Tournament{
		ID: uuid.NewString(),
		URL: url,
		Name: name,
		CurrentRound: currentRound,
		TotalRounds: total,
		LastCheckedAt: time.Now(),
	}, nil
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