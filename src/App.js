import React from "react";
import { useState, useEffect, useRef } from "react";
import Dog from "./assets/dog.png";
import {
    makeStyles,
    Button,
    CircularProgress,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@material-ui/core";
import TypeWriter from "react-typewriter";

function App() {
    const classes = useStyles();
    const [joke, setJoke] = useState({ setup: null, punchline: null });
    const [loading, setLoading] = useState(false);
    const synthRef = useRef(window.speechSynthesis);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

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
                let joke = `${data.setup}...${data.punchline}`;
                const utterThis = new SpeechSynthesisUtterance(joke);
                utterThis.voice = selectedVoice;
                synthRef.current.speak(utterThis);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    useEffect(() => {
        window.addEventListener("keyup", (e) => {
            if (e.code === "KeyJ") {
                getJoke();
            }
        });
        return () => {
            window.removeEventListener("keyup", getJoke);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const myVoices = synthRef.current
                .getVoices()
                .filter(
                    (voice) =>
                        voice.lang === "en-US" && !voice.name.includes("Google")
                );
            console.log(myVoices);
            setVoices([...myVoices]);

            setSelectedVoice(myVoices[0]);
        }, 100);
    }, []);

    return (
        <div>
            <div className={classes.root}>
                <div className="typewriter-container">
                    {joke.setup && joke.punchline && (
                        <TypeWriter typing={1} className={classes.textJoke}>
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
                {voices && (
                    <FormControl size="small" className={classes.select}>
                        <InputLabel shrink id="voice-select-label">
                            Voice
                        </InputLabel>
                        <Select
                            labelId="voice-select-label"
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            label="Voice"
                        >
                            {voices.map((voice) => (
                                <MenuItem key={voice.name} value={voice}>
                                    {voice.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {loading && (
                    <CircularProgress
                        className={classes.loading}
                        color="primary"
                    />
                )}
            </div>
            <div className="footer">
                Vector image by{" "}
                <a href="https://www.freepik.com/catalyststuff">
                    catalyststuff
                </a>
            </div>
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
        select: {
            marginTop: theme.spacing(3),
            minWidth: "100px",
        },
    };
});
