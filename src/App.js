import { useState } from "react";

function App() {
    const [joke, setJoke] = useState({ setup: null, punchline: null });
    const [loading, setLoading] = useState(false);
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
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <div className="root">
            {joke && (
                <div>
                    <p>{joke.setup}</p>
                    <p>{joke.punchline}</p>
                </div>
            )}
            {loading && <p>loading...</p>}
            <button onClick={getJoke}>Tell me a joke</button>
        </div>
    );
}

export default App;
