package serviceinitialize

import (
	"net/http"

	"aksa.local/scrum/server/boards"
	"aksa.local/scrum/server/hash"
	"aksa.local/scrum/server/sessions"
	"aksa.local/scrum/server/timeprovider"
	"aksa.local/scrum/server/users"
	"aksa.local/scrum/server/websocket"

	"aksa.local/scrum/server/votings"

	"aksa.local/scrum/server/boardtemplates"
	"aksa.local/scrum/server/columns"
	"aksa.local/scrum/server/columntemplates"
	"aksa.local/scrum/server/notes"

	"github.com/uptrace/bun"
	"aksa.local/scrum/server/boardreactions"
	"aksa.local/scrum/server/feedback"
	"aksa.local/scrum/server/health"
	"aksa.local/scrum/server/reactions"
	"aksa.local/scrum/server/realtime"
	"aksa.local/scrum/server/sessionrequests"
)

type ServiceInitializer struct {
	clock       timeprovider.TimeProvider
	hash        hash.Hash
	db          *bun.DB
	broker      *realtime.Broker
	checkOrigin bool
	client      *http.Client
}

func NewServiceInitializer(db *bun.DB, broker *realtime.Broker) ServiceInitializer {
	initializer := new(ServiceInitializer)
	initializer.clock = timeprovider.NewClock()
	initializer.hash = hash.NewHashSha512()
	initializer.db = db
	initializer.broker = broker
	initializer.checkOrigin = false
	initializer.client = &http.Client{}

	return *initializer
}

func (init *ServiceInitializer) InitializeBoardService(sessionRequestService sessionrequests.SessionRequestService, sessionService sessions.SessionService, columnService columns.ColumnService, noteService notes.NotesService, reactionService reactions.ReactionService, votingService votings.VotingService) boards.BoardService {
	boardDB := boards.NewBoardDatabase(init.db)
	boardService := boards.NewBoardService(boardDB, init.broker, sessionRequestService, sessionService, columnService, noteService, reactionService, votingService, init.clock, init.hash)

	return boardService
}

func (init *ServiceInitializer) InitializeColumnService(noteService notes.NotesService) columns.ColumnService {
	columnDb := columns.NewColumnsDatabase(init.db)
	columnService := columns.NewColumnService(columnDb, init.broker, noteService)

	return columnService
}

func (init *ServiceInitializer) InitializeBoardReactionService() boardreactions.BoardReactionService {
	boardreactionService := boardreactions.NewBoardReactionService(init.broker)

	return boardreactionService
}

func (init *ServiceInitializer) InitializeBoardTemplateService(columnTemplateService columntemplates.ColumnTemplateService) boardtemplates.BoardTemplateService {
	boardTemplateDb := boardtemplates.NewBoardTemplateDatabase(init.db)
	boardTemplateService := boardtemplates.NewBoardTemplateService(boardTemplateDb, columnTemplateService)

	return boardTemplateService
}

func (init *ServiceInitializer) InitializeColumnTemplateService() columntemplates.ColumnTemplateService {
	columnTemplateDb := columntemplates.NewColumnTemplateDatabase(init.db)
	columntemplateService := columntemplates.NewColumnTemplateService(columnTemplateDb)

	return columntemplateService
}

func (init *ServiceInitializer) InitializeFeedbackService(webhookUrl string) feedback.FeedbackService {
	feedbackService := feedback.NewFeedbackService(init.client, webhookUrl)

	return feedbackService
}

func (init *ServiceInitializer) InitializeHealthService() health.HealthService {
	healthDb := health.NewHealthDatabase(init.db)
	healthService := health.NewHealthService(healthDb, init.broker)

	return healthService
}

func (init *ServiceInitializer) InitializeReactionService() reactions.ReactionService {
	reactionsDb := reactions.NewReactionsDatabase(init.db)
	reactionService := reactions.NewReactionService(reactionsDb, init.broker)

	return reactionService
}

func (init *ServiceInitializer) InitializeSessionService(columnService columns.ColumnService, noteService notes.NotesService) sessions.SessionService {
	sessionDb := sessions.NewSessionDatabase(init.db)
	sessionService := sessions.NewSessionService(sessionDb, init.broker, columnService, noteService)

	return sessionService
}

func (init *ServiceInitializer) InitializeSessionRequestService(websocket sessionrequests.SessionRequestWebsocket, sessionService sessions.SessionService) sessionrequests.SessionRequestService {
	sessionRequestDb := sessionrequests.NewSessionRequestDatabase(init.db)
	sessionRequestService := sessionrequests.NewSessionRequestService(sessionRequestDb, init.broker, websocket, sessionService)

	return sessionRequestService
}

func (init *ServiceInitializer) InitializeWebSocketService() websocket.WebSocketInterface {
	return websocket.NewWebSocketService()
}

func (init *ServiceInitializer) InitializeSessionRequestWebsocket(wsService websocket.WebSocketInterface) sessionrequests.SessionRequestWebsocket {
	return sessionrequests.NewSessionRequestWebsocket(wsService, init.broker)
}

func (init *ServiceInitializer) InitializeUserService(sessionService sessions.SessionService) users.UserService {
	userDb := users.NewUserDatabase(init.db)
	userService := users.NewUserService(userDb, init.broker, sessionService)
	return userService
}

func (init *ServiceInitializer) InitializeNotesService() notes.NotesService {
	notesDB := notes.NewNotesDatabase(init.db)
	notesService := notes.NewNotesService(notesDB, init.broker)

	return notesService
}

func (init *ServiceInitializer) InitializeVotingService() votings.VotingService {
	votingDB := votings.NewVotingDatabase(init.db)
	votingService := votings.NewVotingService(votingDB, init.broker)

	return votingService
}

