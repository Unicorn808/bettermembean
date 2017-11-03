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

function initSideNav() {
	$('.button-collapse').sideNav({
		menuWidth: 300, // Default is 300
		edge: 'right', // Choose the horizontal origin
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true, // Choose whether you can drag to open on touch screens,
		onOpen: function(el) { /* Do Stuff* */ }, // A function to be called when sideNav is opened
      onClose: function(el) { /* Do Stuff* */ }, // A function to be called when sideNav is closed
    }
  );
}