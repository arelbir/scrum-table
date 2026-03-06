package boardreactions

import "go.opentelemetry.io/otel/metric"

var boardReactionsCreatedCounter, _ = meter.Int64Counter(
	"aksa.board_reaction.created.counter",
	metric.WithDescription("Number of created board reactions"),
	metric.WithUnit("board reactions"),
)

