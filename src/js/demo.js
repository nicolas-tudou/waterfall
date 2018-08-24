(function () {
	var oLi = document.getElementsByTagName('li'),
		cpage = 1,
		flag = false,
		minIndex = 0;
	function getPics() {
		// console.log(oLi[minIndex].offsetHeight, document.body.scrollTop + document.documentElement.scrollTop + window.innerHeight)
		if (oLi[minIndex].offsetHeight < window.innerHeight || (oLi[minIndex].offsetHeight < document.body.scrollTop + document.documentElement.scrollTop + window.innerHeight && !flag)) {
			flag = true;
			ajax('get', './getPics.php', 'cpage=' + cpage, showDate, true);
			cpage++;
		}
	}
	getPics();
	document.onscroll = getPics;
	function ajax(method, url, date, callback, flag) {
		var ajaxObj = null;
		if (window.XMLHttpRequest) {
			ajaxObj = new XMLHttpRequest();
		} else {
			ajaxObj = new ActiveXObject('microsoft.XMLHttp');
		}
		var ajaxMethod = method.toUpperCase();
		if (ajaxMethod == 'GET') {
			ajaxObj.open(ajaxMethod, url + '?' + date, flag);
			ajaxObj.send();
		} else if (ajaxMethod == "POST") {
			ajaxObj.open(ajaxMethod, url, flag);
			ajaxObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			ajaxObj.send(date);
		}
		ajaxObj.onreadystatechange = function () {
			if (ajaxObj.readyState == 4) {
				if (ajaxObj.status == 200) {
					callback(ajaxObj.responseText);
				}
			}
		}
	}

	function getMinIndex() {
		for (var i = 0; i < oLi.length; i++) {
			if (oLi[i].offsetHeight < oLi[minIndex].offsetHeight) {
				minIndex = i;
			}
		}
	}

	function showDate(data) {
		var picsArr = JSON.parse(data);
		console.log(picsArr);
		picsArr.forEach(function (ele, index) {
			var oDiv = document.createElement('div'),
				oImg = document.createElement('img'),
				oP = document.createElement('p');
			getMinIndex();
			oDiv.className = 'box';
			oImg.height = oLi[0].offsetWidth * ele.height / ele.width;
			oImg.src = ele.preview;
			oP.innerText = ele.title;
			oDiv.append(oImg);
			oDiv.append(oP);
			oLi[minIndex].append(oDiv);
			oImg.onerror = function () {
				oDiv.remove(oDiv);
				oImg.onerror = null;
			}
		})
		flag = false;
	}
})()