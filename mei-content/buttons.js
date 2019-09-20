var hidden = {
	sideNav: true,
	resBar: true
}

function oc_hide() {
	const resSlider = document.querySelector("#resSlider");
	if (!hidden.sideNav) {
    	document.querySelector(".sidenav").style.right = "-200px";
    	resSlider.style.opacity = "0%";

		hidden.sideNav = true;
		hidden.resBar = true;
	}
	else {
    	document.querySelector(".sidenav").style.right = 0;
		hidden.sideNav = false;
	}
}

function oc_resolution() {
	const resSlider = document.querySelector("#resSlider");
	if (!hidden.resBar) {
    	resSlider.style.opacity = "0";
	    setTimeout(function() {
	        resSlider.style.display = "none";
	    }, 200);
		hidden.resBar = true;
	}
	else {
    	resSlider.style.display = "block";
	    setTimeout(function() {
    		resSlider.style.opacity = "100";
	    }, 1);
		hidden.resBar = false;
	}
}

function oi_resolution() {
   const rVal = document.querySelector("#resRange").value;
   changeRes(rVal);
}