package sessions

import "go.opentelemetry.io/otel/metric"

var sessionCreatedCounter, _ = meter.Int64Counter(
	"aksa.sessions.created.counter",
	metric.WithDescription("Number of created sessions"),
	metric.WithUnit("sessions"),
)

var connectedSessions, _ = meter.Int64UpDownCounter(
	"aksa.sessions.connected",
	metric.WithDescription("Number of connected sessions"),
	metric.WithUnit("sessions"),
)

var bannedSessionsCounter, _ = meter.Int64Counter(
	"aksa.sessions.banned.counter",
	metric.WithDescription("Number of banned sessions"),
	metric.WithUnit("sessions"),
)

