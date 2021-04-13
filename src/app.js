import "./serviceWorkerRegistration"

/* Style */
import "materialize-css/dist/css/materialize.min.css"
import "materialize-css/dist/js/materialize.min"
import "webpack-material-design-icons/material-design-icons.css"
import "src/style/style.css"

/* Component */
import "src/component/navigation/index"
import "src/component/league_standings/index"
import "src/component/team/index"
import "src/component/team_info/index"
import "src/component/favorite/index"

/* Main */
import main from "src/main"

document.addEventListener("DOMContentLoaded", main)
