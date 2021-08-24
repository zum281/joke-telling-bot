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
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import TypeWriter from "react-typewriter";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

function App() {
    const commands = [
        {
            command: "Tell me a joke",
            callback: () => getJoke(),
        },
        {
            command: "joke",
            callback: () => getJoke(),
        },
    ];
    const { listening, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition({ commands });
    const classes = useStyles();
    const [joke, setJoke] = useState({ setup: null, punchline: null });
    const [loading, setLoading] = useState(false);
    const synthRef = useRef(window.speechSynthesis);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState({});
    const [micBtn, setMicBtn] = useState({
        supported: browserSupportsSpeechRecognition,
        text: "Start",
        icon: <MicIcon />,
    });

    const resetJoke = () => {
        setJoke({ setup: null, punchline: null });
    };

    const getJoke = () => {
        resetJoke();
        setLoading(true);
        resetTranscript();
        handleMic();
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

    const handleMic = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            let newMicBtn = { ...micBtn };
            newMicBtn.text = "Start";
            newMicBtn.icon = <MicIcon />;
            setMicBtn({ ...newMicBtn });
        } else {
            SpeechRecognition.startListening({
                continuous: true,
                language: "en-US",
            });
            let newMicBtn = { ...micBtn };
            newMicBtn.text = "Stop";
            newMicBtn.icon = <MicOffIcon />;
            setMicBtn({ ...newMicBtn });
        }
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
        console.log(synthRef.current.getVoices());
        setTimeout(() => {
            const myVoices = synthRef.current
                .getVoices()
                .filter(
                    (voice) =>
                        voice.lang === "en-US" && !voice.name.includes("Google")
                );
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
                <div className={classes.btnsContainer}>
                    <Tooltip title="Press J to hear a joke" placement="left">
                        <Button
                            className={classes.btn}
                            variant="contained"
                            color="primary"
                            onClick={getJoke}
                            size="small"
                        >
                            Tell me a joke!
                        </Button>
                    </Tooltip>

                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={micBtn.icon}
                        disabled={!browserSupportsSpeechRecognition}
                        onClick={handleMic}
                    >
                        {micBtn.supported
                            ? micBtn.text
                            : "no speech recognition"}
                    </Button>
                </div>

                {voices.length !== 0 && (
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
        btnsContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(1),
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
