var PdfExport = ( function( _Reveal ){

	var Reveal = _Reveal;
	var setStylesheet = null;
	var installAltKeyBindings = null;

	function getRevealJsPath(){
		var regex = /\b[^/]+\/reveal.css$/i;
		var script = Array.from( document.querySelectorAll( 'link' ) ).find( function( e ){
			return e.attributes.href && e.attributes.href.value.search( regex ) >= 0;
		});
		if( !script ){
			console.error( 'reveal.css could not be found in included <link> elements. Did you rename this file?' );
			return '';
		}
		return script.attributes.href.value.replace( regex, '' );
	}

	function setStylesheet3( pdfExport ){
		var link = document.querySelector( '#print' );
		if( !link ){
			link = document.createElement( 'link' );
			link.rel = 'stylesheet';
			link.id = 'print';
			document.querySelector( 'head' ).appendChild( link );
		}
		var style = 'paper';
		if( pdfExport ){
			style = 'pdf';
		}
		link.href = getRevealJsPath() + 'css/print/' + style + '.css';
	}

	function setStylesheet4( pdfExport ){
	}

	function installAltKeyBindings3(){
	}

	function installAltKeyBindings4(){
		if( isPrintingPDF() ){
			var config = Reveal.getConfig();
			var shortcut = config.pdfExportShortcut || 'E';
			window.addEventListener( 'keydown', function( e ){
				if( e.target.nodeName.toUpperCase() == 'BODY'
					&& ( e.key.toUpperCase() == shortcut.toUpperCase() || e.keyCode == shortcut.toUpperCase().charCodeAt( 0 ) ) ){
					e.preventDefault();
					togglePdfExport();
					return false;
				}
			}, true );
		}
	}
	
	function isPrintingPDF(){
		return ( /print-pdf/gi ).test( window.location.search );
	}

	function togglePdfExport(){
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		if( isPrintingPDF() ){
			query_doc.delete( 'print-pdf' );
		}else{
			query_doc.set( 'print-pdf', '' );
		}
		url_doc.search = ( query_doc.toString() ? '?' + query_doc.toString() : '' );
		window.location.href = url_doc.toString();
	}

	function installKeyBindings(config){
		// var config = Reveal.getConfig();
		var shortcut = config.pdfExportShortcut || 'E';
		Reveal.addKeyBinding({
			keyCode: shortcut.toUpperCase().charCodeAt( 0 ),
			key: shortcut.toUpperCase(),
			description: 'PDF export mode'
		}, togglePdfExport );
		installAltKeyBindings();
	}

	function removeFragmentsOnCodeElements() {
		// Each fragment 'group' is an array containing one or more
		// fragments. Multiple fragments that appear at the same time
		// are part of the same group.
		// const fragmentGroups = Reveal.fragments.sort( document.querySelectorAll( 'code.fragment' ), true );
		// Remove .fragment class from code elements
		document.querySelectorAll("code.fragment").forEach(el => {
			el.remove();
		});

		// let previousFragmentStep;

		// fragmentGroups.forEach(function( fragments, index ) {
		// 	// Remove 'current-fragment' from the previous group
		// 	if( previousFragmentStep ) {
		// 		previousFragmentStep.forEach( function( fragment ) {
		// 			fragment.classList.remove( 'current-fragment' );
		// 		} );
		// 	}

		// 	// Show the fragments for the current index
		// 	fragments.forEach( function( fragment ) {
		// 		fragment.classList.add( 'visible', 'current-fragment' );
		// 	});

		// 	// Create a separate page for the current fragment state
		// 	// const clonedPage = page.cloneNode( true );

		// 	// Inject unique page numbers for fragments
		// 	if( injectPageNumbers ) {
		// 		// const numberElement = clonedPage.querySelector( '.slide-number-pdf' );
		// 		const fragmentNumber = index + 1;
		// 		numberElement.innerHTML += '.' + fragmentNumber;
		// 	}

		// 	// pages.push( clonedPage );
		// 	previousFragmentStep = fragments;
		// });

		// Reset the first/original page so that all fragments are hidden
		// fragmentGroups.forEach( function( fragments ) {
		// 	fragments.forEach( function( fragment ) {
		// 		fragment.classList.remove( 'visible', 'current-fragment' );
		// 	} );
		// } );
	}

	function install(){
		var config = Reveal.getConfig();
		installKeyBindings(config);
		setStylesheet( isPrintingPDF() );
		// Custom configs on printing

		if (config.pdfSeparateFragments && config.pdfSeparateFragmentsAndJoinCodes) {
			removeFragmentsOnCodeElements();
		}
	}

	var Plugin = {
	}

	if( Reveal && Reveal.VERSION && Reveal.VERSION.length && Reveal.VERSION[ 0 ] == '3' ){
		// reveal 3.x
		setStylesheet = setStylesheet3;
		installAltKeyBindings = installAltKeyBindings3;
		install();
	}else{
		// must be reveal 4.x
		setStylesheet = setStylesheet4;
		installAltKeyBindings = installAltKeyBindings4;
		Plugin.id = 'pdf-export';
		Plugin.init = function( _Reveal ){
			Reveal = _Reveal;
			install();
		};
	}

	return Plugin;

})( Reveal );