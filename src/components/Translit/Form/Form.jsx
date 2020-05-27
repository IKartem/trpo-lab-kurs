import React, { useState, useEffect } from "react";
import TranslitMap from "../../../utils/TranslitMap";
import EventEmitter from "../../../utils/EventEmitter";

function Form(props) {
	const [translitText, setTranslitText] = useState("");
	const [answerText, setAnswerText] = useState("");

	useEffect(() => {
		let checkArr = sessionStorage.getItem("answerArr");
		if (!checkArr || checkArr.length === 0) {
			sessionStorage.setItem("answerArr", JSON.stringify([]));
		}
	}, []);

	function handleChange(e) {
		setTranslitText(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();

		let answer = "";
		let tmp = "";
		for (let ch of translitText) {
			tmp = TranslitMap.get(ch);
			if (tmp === undefined) answer += ch;
			else answer += tmp;
		}
		setAnswerText(answer);
		let newArr = JSON.parse(sessionStorage.getItem("answerArr"));
		newArr.push(answer);
		sessionStorage.setItem("answerArr", JSON.stringify(newArr));
		EventEmitter.dispatch("answerArrChange", e);
	}

	return (
		<form>
			<label>
				Переводчик на транслит
				<input
					type="text"
					value={translitText}
					onChange={(event) => handleChange(event)}
				/>
			</label>
			<button onClick={(event) => handleSubmit(event)}>Translit</button>
			<h1>{answerText}</h1>
		</form>
	);
}

export default Form;
