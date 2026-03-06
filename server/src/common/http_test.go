package common

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDomainOfSealedCookieWithPort(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local:3000"}
	c := http.Cookie{}

	SealCookie(&r, &c)

	assert.Equal(t, "aksa.local", c.Domain)
}

func TestDomainOfSealedCookieWithoutPort(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local"}
	c := http.Cookie{}

	SealCookie(&r, &c)

	assert.Equal(t, "aksa.local", c.Domain)
}

func TestGetTopLevelHostnameWithSubdomain(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local"}
	assert.Equal(t, "aksa.local", GetTopLevelHost(&r))
}

func TestGetTopLevelHostnameWithoutSubdomain(t *testing.T) {
	r := http.Request{Host: "aksa.local"}
	assert.Equal(t, "aksa.local", GetTopLevelHost(&r))
}

func TestGetTopLevelHostnameWithSubdomainAndPort(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local:3000"}
	assert.Equal(t, "aksa.local", GetTopLevelHost(&r))
}

func TestGetHostnameWithoutPortWithPort(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local:3000"}
	assert.Equal(t, "beta.aksa.local", GetHostWithoutPort(&r))
}

func TestGetHostnameWithoutPortWithoutPort(t *testing.T) {
	r := http.Request{Host: "beta.aksa.local"}
	assert.Equal(t, "beta.aksa.local", GetHostWithoutPort(&r))
}
func TestGetTopLevelHostnameWithPublicSuffix(t *testing.T) {
	r := http.Request{Host: "example.stackit.rocks"}
	assert.Equal(t, "example.stackit.rocks", GetTopLevelHost(&r))
}

func TestGetTopLevelHostnameWithPublicSuffixWithoutSubdomain(t *testing.T) {
	r := http.Request{Host: "stackit.rocks"}
	assert.Equal(t, "", GetTopLevelHost(&r))
}

func TestDomainOfSealedCookieWithPublicSuffix(t *testing.T) {
	r := http.Request{Host: "example.stackit.rocks"}
	c := http.Cookie{}

	SealCookie(&r, &c)

	assert.Equal(t, "example.stackit.rocks", c.Domain)
}

func TestDomainOfSealedCookieWithPublicSuffixWithoutSubdomain(t *testing.T) {
	r := http.Request{Host: "stackit.rocks"}
	c := http.Cookie{}

	SealCookie(&r, &c)

	assert.Equal(t, "", c.Domain)
}

