package api

import (
	"net/http"

	"github.com/go-chi/render"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"aksa.local/scrum/server/logger"
)

//var tracer trace.Tracer = otel.Tracer("aksa.local/scrum/server/api")

func (s *Server) healthCheck(w http.ResponseWriter, r *http.Request) {
	ctx, span := tracer.Start(r.Context(), "aksa.health.api")
	defer span.End()
	log := logger.FromContext(ctx)

	realtimeHealthy := s.health.IsRealtimeHealthy(ctx)
	databaseHealthy := s.health.IsDatabaseHealthy(ctx)

	span.SetAttributes(
		attribute.Bool("aksa.health.api.database.healthy", databaseHealthy),
		attribute.Bool("aksa.health.api.realtime.healthy", realtimeHealthy),
	)

	if realtimeHealthy && databaseHealthy {
		render.Status(r, http.StatusNoContent)
		render.Respond(w, r, nil)
		return
	}

	span.SetStatus(codes.Error, "service not healthy")
	log.Errorw("service is not healthy", "realtime", realtimeHealthy, "database", databaseHealthy)
	render.Status(r, http.StatusServiceUnavailable)
	render.Respond(w, r, nil)
}


