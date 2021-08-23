import React from "react";
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Dog from "./assets/dog.png";
import {
    makeStyles,
    Button,
    CircularProgress,
    Tooltip,
} from "@material-ui/core";
import TypeWriter from "react-typewriter";

function App() {
    const classes = useStyles();
    const [joke, setJoke] = useState({ setup: null, punchline: null });
    const [loading, setLoading] = useState(false);
    const { speak } = useSpeechSynthesis();
    const resetJoke = () => {
        setJoke({ setup: null, punchline: null });
    };

    const getJoke = () => {
        resetJoke();
        setLoading(true);
        fetch("https://official-joke-api.appspot.com/jokes/random")
            .then((res) => res.json())
            .then((data) => {
                let newJoke = {
                    setup: data.setup,
                    punchline: data.punchline,
                };
                setJoke({ ...newJoke });
                setLoading(false);
                speak({ text: `${data.setup}...${data.punchline}` });
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <div className={classes.root}>
            <div class="typewriter-container">
                {joke.setup && joke.punchline && (
                    <TypeWriter
                        initDelay={0}
                        typing={1}
                        className={classes.textJoke}
                    >
                        {joke.setup}... {joke.punchline}
                    </TypeWriter>
                )}
            </div>
            <img className={classes.dog} src={Dog} alt="Koje the dog" />
            <Tooltip title="Press J to hear a joke" placement="right">
                <Button
                    className={classes.btn}
                    variant="contained"
                    color="primary"
                    onClick={getJoke}
                    size="large"
                >
                    Tell me a joke!
                </Button>
            </Tooltip>

            {loading && (
                <CircularProgress className={classes.loading} color="primary" />
            )}
        </div>
    );
}

export default App;

const useStyles = makeStyles((theme) => {
    return {
        root: {
            maxWidth: "1400px",
            minHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            position: "relative",
        },
        dog: {
            width: "20%",
            minWidth: "250px",
            maxWidth: "500px",
        },
        btn: {
            marginTop: theme.spacing(5),
        },
        loading: {
            position: "absolute",
            top: 0,
            marginTop: theme.spacing(19),
        },
        textJoke: {
            marginTop: theme.spacing(5),
            lineHeight: 1.5,
            fontSize: "1.3rem",
            paddingRight: theme.spacing(1),
        },
    };
});
