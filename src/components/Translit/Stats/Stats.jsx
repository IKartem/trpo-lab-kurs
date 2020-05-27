import React, { useState, useEffect } from "react";
import EventEmitter from "../../../utils/EventEmitter";
import { Bar as BarChart } from "react-chartjs-2";

function Form(props) {
	const [wordsArr, setWordsArr] = useState([]);
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "My First dataset",
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderColor: ["rgba(255,99,132,1)"],
				borderWidth: 1,
				data: [],
			},
		],
	});

	useEffect(() => {
		const updatedWordsArr = JSON.parse(sessionStorage.getItem("answerArr"));
		let newDataForChart = chartData;
		newDataForChart.labels = [];
		newDataForChart.datasets[0].data = [];
		setWordsArr(updatedWordsArr);
		Object.entries(
			updatedWordsArr.reduce((acc, item) => {
				let lettersArr =
					item.toLowerCase().match(/([a-z]|[0-9])/gi) || [];

				lettersArr.forEach((letter) => {
					if (!acc[letter]) {
						acc[letter] = 0;
					}

					acc[letter]++;
				});

				return acc;
			}, {})
		).forEach(([key, value]) => {
			newDataForChart.labels.push(key);
			newDataForChart.datasets[0].data.push(value);
		});

		setChartData({ ...newDataForChart });

		EventEmitter.subscribe("answerArrChange", (event) => {
			let updatedWordsArr = JSON.parse(
				sessionStorage.getItem("answerArr")
			);

			setWordsArr(updatedWordsArr);

			let newDataForChart = chartData;
			newDataForChart.labels = [];
			newDataForChart.datasets[0].data = [];
			Object.entries(
				updatedWordsArr.reduce((acc, item) => {
					let lettersArr =
						item.toLowerCase().match(/([a-z]|[0-9])/gi) || [];

					lettersArr.forEach((letter) => {
						if (!acc[letter]) {
							acc[letter] = 0;
						}

						acc[letter]++;
					});

					return acc;
				}, {})
			).forEach(([key, value]) => {
				newDataForChart.labels.push(key);
				newDataForChart.datasets[0].data.push(value);
			});

			setChartData({ ...newDataForChart });
		});
	}, []);

	const options = {
		scales: {
			xAxes: [
				{
					stacked: true,
				},
			],
			yAxes: [
				{
					stacked: true,
				},
			],
		},
	};

	function answerArrUpdate(event) {
		setWordsArr(JSON.parse(sessionStorage.getItem("answerArr")));
	}

	function getLettersCount() {
		let res = 0;

		wordsArr.forEach((item) => {
			let newStr = item.replace(/[\s.,%?]/g, "");
			console.log(newStr);
			res += newStr.length;
		});

		return <h4>{res}</h4>;
	}

	function getWordsCount() {
		let res = 0;
		wordsArr.forEach((item) => {
			let count = item.split(/\s+\b/).length;
			console.log(item + " " + count);
			res += count;
		});
		return <h4>{res}</h4>;
	}

	function getSentenseCount() {
		let res = 0;

		wordsArr.forEach((item) => {
			let sentenseEndChars = [".", "?", "!"];
			// let count = item.match(/(\.|\!|\?)( |$)/g || []).length;
			let count = item
				.split("")
				.filter((e) => sentenseEndChars.includes(e)).length;

			if (!sentenseEndChars.includes(item.charAt(item.length - 1)))
				count++;

			res += count;
		});

		return <h4>{res}</h4>;
	}

	return (
		<div>
			<h1>Числова статистика по введеным словам</h1>
			<h3>Символов</h3>
			{getLettersCount()}
			<h3>Слов</h3>
			{getWordsCount()}
			<h3>Предложений</h3>
			{getSentenseCount()}
			<BarChart
				data={chartData}
				options={options}
				width="600"
				height="150"
			/>
		</div>
	);
}

export default Form;
