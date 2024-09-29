import { useState } from "react";
import './Login.css';

function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [signUp, setSignUp] = useState(false);

    function validateForm(data) {
        const errors = { name: "", pass: "" };
        console.log("validateForm errors object", errors);

        if (!data.name) {
          errors.name = "Username is required";
        } else if (!/^[a-zA-Z0-9\s'-]+$/.test(data.name.trim())) {
            errors.name =
            "Username can only contain letters, numbers, spaces, hyphens, and apostrophes.";
        }
        if (!data.pass) {
          errors.pass = "Password is required";
        } else if (!/^[a-zA-Z0-9\s.,!?'"-:()]+$/.test(data.pass.trim())) {
          errors.pass = "Password can only contain letters, numbers, spaces, and common punctuation.";
        }
        return errors;
    }

    function handleSubmit(event) {
        console.log("submitting");
        event.preventDefault();
        setErrors({});

        const validationErrors = validateForm({
            name: event.target.username.value,
            pass: event.target.password.value,
        });

        console.log("validating...");

        if (validationErrors.name === "" && validationErrors.pass === "") {
            if (signUp) {
                signup();
            } else {
                login();
            }
        }
        setUsername("");
        setPassword("");
    }

    function signup() {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        if (file) {
            formData.append("file", file);
        }

        fetch("http://localhost:5555/signup", {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        console.log("Sign-Up Successful");
    }

    function login() {
        console.log("signing in...");
        fetch("http://localhost:5555/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUser(data);
            });
    }

    function handleSignUpButton(event) {
        event.preventDefault();
        setSignUp(!signUp);
    }

    return (
        <>
        <div className="container">
            <div className="title">
                <h1>ChatVerse</h1>
            </div>
            <div>
                <h3>Sign Up or Log In</h3>
                <form onSubmit={handleSubmit}>
                    <input defaultValue="true" name="remember" type="hidden" />
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            autoComplete="username"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            type="text"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            autoComplete="current-password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            type="password"
                        />
                    </div>
                    {signUp && (
                        <div>
                            <label htmlFor="file">Profile Photo</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                    )}
                    <div>
                        <button type="submit">
                            {!signUp ? "Login" : "Sign up"}
                        </button>
                    </div>
                </form>
                <div>
                    <p>
                        {" "}
                        {!signUp
                        ? "Don't have an account ?"
                        : "Already have an account ?"}{" "}
                    </p>
                    <button type="submit" onClick={handleSignUpButton}>
                        {!signUp ? "Sign up" : "Login"}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default Login;