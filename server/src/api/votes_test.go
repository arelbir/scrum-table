package api

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"aksa.local/scrum/server/common"
	"aksa.local/scrum/server/identifiers"
	"aksa.local/scrum/server/logger"
	"aksa.local/scrum/server/technical_helper"
	"aksa.local/scrum/server/votings"

	"github.com/google/uuid"

	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type VoteTestSuite struct {
	suite.Suite
}

func TestVoteTestSuite(t *testing.T) {
	suite.Run(t, new(VoteTestSuite))
}

func (suite *VoteTestSuite) TestAddVote() {

	testParameterBundles := *TestParameterBundles{}.
		Append("all ok", http.StatusCreated, nil, false, false, nil).
		Append("specific error", http.StatusTeapot, &common.APIError{
			Err:        errors.New("check"),
			StatusCode: http.StatusTeapot,
			StatusText: "teapot",
			ErrorText:  "Error",
		}, false, false, nil).
		Append("unexpected error", http.StatusInternalServerError, errors.New("teapot?"), false, false, nil)

	for _, tt := range testParameterBundles {
		suite.Run(tt.name, func() {
			s := new(Server)
			votingMock := votings.NewMockVotingService(suite.T())

			boardId, _ := uuid.NewRandom()
			userId, _ := uuid.NewRandom()
			noteId, _ := uuid.NewRandom()

			s.votings = votingMock

			req := technical_helper.NewTestRequestBuilder("POST", "/", strings.NewReader(fmt.Sprintf(`{
				"note": "%s"
				}`, noteId.String())))
			req.Req = logger.InitTestLoggerRequest(req.Request())
			req.AddToContext(identifiers.BoardIdentifier, boardId).
				AddToContext(identifiers.UserIdentifier, userId)

			votingMock.EXPECT().AddVote(mock.Anything, votings.VoteRequest{
				Board: boardId,
				User:  userId,
				Note:  noteId,
			}).Return(&votings.Vote{
				Note: noteId,
			}, tt.err)

			rr := httptest.NewRecorder()
			s.addVote(rr, req.Request())
			suite.Equal(tt.expectedCode, rr.Result().StatusCode)
			votingMock.AssertExpectations(suite.T())
		})
	}

}

