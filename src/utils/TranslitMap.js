import TranslitConfig from "../cfg/TranslitConfig";

let TranslitMap = new Map();

TranslitConfig.map((item) => {
	TranslitMap.set(item.ru, item.eng);
});

export default TranslitMap;
