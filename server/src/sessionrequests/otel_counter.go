package sessionrequests

import "go.opentelemetry.io/otel/metric"

var sessionRequestsCreatedCounter, _ = meter.Int64Counter(
	"aksa.session_requests.created.counter",
	metric.WithDescription("Number of created session requests"),
	metric.WithUnit("session requests"),
)

var websocketOpenedCounter, _ = meter.Int64Counter(
	"aksa.websocket.opened.counter",
	metric.WithDescription("Number of opened websockets"),
	metric.WithUnit("websockets"),
)

var websocketClosedCounter, _ = meter.Int64Counter(
	"aksa.websocket.closed.counter",
	metric.WithDescription("Number of closed websockets"),
	metric.WithUnit("websockets"),
)

