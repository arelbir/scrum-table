import {render} from "testUtils";
import {Boards} from "routes/Boards/Boards";

const renderBoards = () => render(<Boards />);

// like Templates, thunks don't work yet in this enviroment,
// TODO: enable when related issue is resolved.
describe.skip("Boards", () => {
  it("should render correctly", () => {
    const {container} = renderBoards();

    expect(container).toMatchSnapshot();
  });
});


