port module Main exposing (..)

-- This line imports functions that generate HTML
import Html exposing (Html, button, div, text)
import Html
import Debug
import RGB

type Msg =
  SubstitutePage String

type alias Model = String

main : Program Never Model Msg
main =
    Html.program
      { init = ("<unused>", Cmd.none)
      , view = view
      , update = update
      , subscriptions = subscriptions
      }


-- This will be the rendered HTML (an empty div)
view : Model -> Html Msg
view model = text model


-- The update function will be used to update the rendered HTML
update : Msg -> Model -> (Model, Cmd Msg)
update msg model = (model, process msg)

process : Msg -> Cmd Msg
process msg =
    case msg of
        SubstitutePage fromBrowser ->
            substitutePageResponse (fromBrowser ++ " response")


subscriptions : Model -> Sub Msg
subscriptions model = substitutePage (\dom -> SubstitutePage <| Debug.log "DOM" dom)

port substitutePage : (String -> msg) -> Sub msg
port substitutePageResponse : String -> Cmd msg
