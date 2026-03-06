package notes

import "go.opentelemetry.io/otel/metric"

var notesCreatedCounter, _ = meter.Int64Counter(
	"aksa.notes.created.counter",
	metric.WithDescription("Number of created notes"),
	metric.WithUnit("notes"),
)

var notesDeletedCounter, _ = meter.Int64Counter(
	"aksa.notes.deleted.counter",
	metric.WithDescription("Number of deleted notes"),
	metric.WithUnit("notes"),
)

var notesImportCounter, _ = meter.Int64Counter(
	"aksa.notes.import.counter",
	metric.WithDescription("Number of imported notes"),
	metric.WithUnit("notes"),
)

