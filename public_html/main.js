function checkBrowser() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		const landing = $('#landing-1');
		landing.addClass('center s12');
		landing.removeClass('s9');
		const signin = $('#sign-in-card');
		signin.addClass('center s12');
		signin.removeClass('s4');
		$('#get-started').removeClass('right');
		for (const i=0; i<6; i++) {
			$('#landing-' + i).addClass('center');
		}
		console.log('found mobile browser');
	} else {
		console.log("didn't find mobile browser");
	}
}