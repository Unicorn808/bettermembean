function checkBrowser() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('#landing-1').addClass('center s12');
		$('#landing-1').removeClass('s9');
		$('#get-started').removeClass('right');
		for (var i=0; i<6; i++) {
			$('#landing-' + i).addClass('center');
		}
		console.log('found mobile browser');
	} else {
		console.log("didn't find mobile browser");
	}
}