(function CACustomScripts() {
	/**
		Polyfill for ChildNode.remove() for IE 11+
		From https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
		Who got it from https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
		**/
	const debug = true;
	(function (arr) {
		arr.forEach(function (item) {
			if (item.hasOwnProperty('remove')) { 
				return; 
			}
			Object.defineProperty(item, 'remove', {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					this.parentNode.removeChild(this);
				}
			});
		});
	})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
	
	/* Utility function to get an animation frame */
	let ticking = false;
	
	/* 
		Tests is a selector is a String or DOM Node, retunrs the selected Node if it can
		Throws an Error otherwise
		*/
	function _getDOMNode(selector) {
		let $el = null;
		if (typeof selector === 'string') {
			if (document.querySelector(selector) === null) {
				return null;
			}
			$el = document.querySelector(selector);
			return $el ;
		} else if (selector instanceof Node) {
			$el = selector;
			return $el;
		} else {
			throw new Error(`Element selector must be a String value or a Document Node object`);
		}
	}
	/* 	
		Tests will a string selector will return a DOM Node, retunrs an array of Nodes if it can
		Throws an Error otherwise
		*/
	function _getAllDOMNodes(selector) {
		let $els = null;
		if (typeof selector === 'string') {
			if (document.querySelectorAll(selector) === null) {
				return null;
			}
			$els = document.querySelectorAll(selector);
			return $els ;
		} else {
			throw new Error(`Element selector must be a String value`);
		}
	}
	function getTick() {
		if (!ticking) {
			requestAnimationFrame(() => {
				addClass('.page-bottom-links-top', 'is-visible');
			});
			ticking = true;
		}
	}
	/**
		Adds a class to a Node list with a timeout between each  
		selector: 			DOM Node selector
		timeout: 				delay between each iteration
		*/
	function addClassTimed(els, className, timeout) {
		let $els = [];
		if (Array.isArray(els)) {
			$els = els;
		} else if (els instanceof Node) {
			$els[0] = _getDOMNode(els);	
		} else if (_getAllDOMNodes(els).length > 0) {
			$els = _getAllDOMNodes(els);	
		} else {
			throw new Error('addClassTimed selector must return a DOM node');
		}
		
		function _addClass() {
			setTimeout(() => {
				if (count < $els.length) {
					$els[count].classList.add(className); 
					count++;
					_addClass($els[count], className); 
				} else {
					return;
				}
			}, timeout);
		}
		let count = 0;
		_addClass();
	}//addClassTimed()
	/** 
		el: 				DOM HTML Element
		classList: 	One or more classes to add
		*/
	function addClass(el, classList) {
		let $el = null;
		if (debug) {
			console.log(`BC addClass`);
			console.log(`-----------`);
			console.log(`el classList start: ${el.classList}`);
		}
		if (arguments.length < 2) {
			throw new Error(`BC function addClass: Requiers a String or DOM Node element then a list of class names`);
		}
		if (_getDOMNode(el) !== null) {
			$el = _getDOMNode(el);	
		} else {
			throw new Error('addClass selector must be a DOM node');
		}
		if (debug) {
			console.log(`el DOM node: ${$el} retrieved ${$el.classList}`);
		}
		function _addClass(cls) {
			if (document.querySelector('html').contains($el)) {
				if (debug) {
					console.log(`_addClass() inner function`);
					console.log(`Is a DOM node`);
				}
				if (!ticking) {
					if (debug) {
						console.log(`ticking is ${ticking}`);
					}
					requestAnimationFrame(() => {
						$el.classList.add(cls);
						if (debug) {
							console.log(`requestAnimationFrame`);
							console.log(`Class added:`);
							console.log(`${$el.classList}`);
						}
					});
					ticking = true;	
					
				}
				ticking = false;
				
			} else {
				$el.classList.add(cls);
			}
			if (debug) {
				console.log(`_addClass() inner function`);
				console.log(`${$el.classList}`);
			}
		}
		for (let arg = 1; arg < arguments.length; arg++) {
			if (debug) {
				console.log(`For arguments.length ${arg}`);
			}
			_addClass(arguments[arg]);
		}
		if (debug) {
			console.log(`-----------`);
		}
	}//addClass()
	/** 
		Check if an element has a class
		el:				DOM HTML Element
		className:One or more classes to add
		returns: 	true/false or error if the el is not a DOM node or a valid query selector
		*/
	function hasClass(el, className) {
		let $el = null;
		if (arguments.length < 2) {
			throw new Error(`BC function addClass: Requiers a String or DOM Node element then a list of class names`);
		}
		if (_getDOMNode(el) !== null) {
			$el = _getDOMNode(el);	
		} else {
			throw new Error('addClass selector must be a DOM node');
		}
		return $el.classList.contains(className);
	}//addClass()
	function removeClass(el, classList) {
		let $el = null;
		if (arguments.length < 2) {
			throw new Error(`Requires a String or DOM Node element then a list of class names`);
		}
		$el = _getDOMNode(el);
		function _removeClass(cls) {
			if (document.querySelector('html').contains($el)) {
				if (!ticking) {
					requestAnimationFrame(() => {
						$el.classList.remove(cls);
					});
					ticking = true;
				}
				ticking = false;	
			} else {
				$el.classList.remove(cls);
			}
		}
		for (let arg = 1; arg < arguments.length; arg++) {
				_removeClass(arguments[arg]);
		}
	}//addClass()
	function emptyElement(el) {
		if (_getDOMNode(el)) {
			const $el = _getDOMNode(el);
			while ($el.firstChild) {
				el.removeChild($el.firstChild);
			}
		}
	}
	//AJAX functions
	function bcAJAX(url, options) {
		if (options !== undefined) {
			return fetch(url, options);	
		} else {
			return fetch(url);
		}
		
	}
	function getJSON(url, opts) {
		this.options = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		if (opts) {
			this.options = Object.assign(this.options, opts);
		}
		return bcAJAX(url, this.options).then((data) => {
			return Promise.resolve(data);
		}).catch((err) => {
			return Promise.reject(err);
		});
	}
	
	/**
		Animation functions
		*/
	//Liner interpolation
	
	if (debug) {
		var i = 0;	
	}
	
	function lerpScroll($el, pos, target, speed = 0.075) {
		if (debug) {
			console.log(`Lerp ${i}`); 
			console.log(`---------`);
		}
		const scrollOptions = {};
		if (Math.round(target) > Math.round(pos)) {
			if (debug) {
				console.log(`${pos} ${target}`);
				console.log(`${(pos - target)}`);
			}
			pos += (target - pos) * speed; 
			if (debug) { 
				console.log(`${pos} ${target}`);
			}
			scrollOpts = {
				top: pos,
				left: 0,
				behavior: 'auto'
			};
			$el.scroll(0, pos);
			if (debug) {
				console.log(`${$el.scrollY}`);
				i++;
			}
			requestAnimationFrame(() => {
				lerpScroll($el, pos, target); 
			});
		} else if (Math.round(pos) > Math.round(target)) {
			if (debug) {
				console.log(`${pos} ${target}`);
				console.log(`${(pos - target)}`);
			}
			pos -= (pos - target) * speed; 
			if (debug) {
				console.log(`${pos} ${target}`);	
			}
			scrollOpts = {
				top: pos,
				left: 0,
				behavior: 'auto'
			};
			$el.scroll(scrollOpts);
			if (debug) {
				console.log(`${$el.scrollY}`);
			i++;	
			}
			requestAnimationFrame(() => {
				lerpScroll($el, pos, target);
			});
		} else {
			return;
		} 
	}//Lerp scroll
	let isLerpHeightTicking = false;
	function adjustHeight($el, target, speed = 0.075, cb = null) {
		if (isLerpHeightTicking === true) {
			return;
		}
		lerpHeight($el, target, speed) ;	
		function lerpHeight($el, target, speed = 0.075) {
			isLerpHeightTicking = true;
			if (debug) {
				console.log(`$el height: ${$el.style.height}`); 
			}
			let h = ($el.style.height !== '' && $el.style.height !== undefined ) ? parseFloat($el.style.height) : $el.clientHeight;
			if (debug) {
				if (i > 500) {
					return;
				}
				console.log(`Lerp ${i}`); 
				console.log(`---------`);
				console.log(`Height: ${h} Target: ${target}`);
				console.log(`Difference: ${(h - target)}`);
			}
			if (Math.round(target) > Math.round(h)) {
				if (debug) {
					console.log(`Target > Height`);
					console.log(`Raw height to add: ${(target - h) * speed}`); 
				}
				h += (target - h) * speed; 
				if (debug) { 
					console.log(`New height: ${h} Target: ${target}`);
				}
				$el.style.height = h + 'px';
				if (debug) {
					console.log(`Element style.height: ${$el.style.height}`);
					i++;
				}
				requestAnimationFrame(() => {
					lerpHeight($el, target, speed); 
				});
			} else if (Math.round(h) > Math.round(target)) {
				if (debug) {
					console.log(`Height > Target`);
					console.log(`Raw height to subtract: ${(h - target) * speed}`); 
				}
				h -= (h - target) * speed; 
				if (debug) {
					console.log(`New height: ${h} Target: ${target}`);	
				}
				$el.style.height = h + 'px';
				if (debug) {
					console.log(`${$el.style.height}`);
				i++;	
				}
				requestAnimationFrame(() => {
					lerpHeight($el, target, speed);
				});
			} else {
				isLerpHeightTicking = false;
				return;
			} 
		}//Lerp scroll
		if (typeof cb === 'function') {
			cb();	
		}
		
		return;
	}
	
	/* Window scrolling */
	let lastScrollY 		= window.scrollY;
	let thisScrollY 		= 0;
	let scrollDirection = 0; 
	function detectScrollPosition($el = window) {
		return $el.scrollY;
	}//detectScrollPosition()
	function detectScrollDirection($el = window) {
		//let lastScrollY = $el.scrollY;
		let scrollDirection = -1; //down, up = 1
		scrollDirection = (lastScrollY < $el.scrollY) ? -1 : 1;
		lastScrollY = $el.scrollY;
		return scrollDirection;
		
	}//detectScrollDirection()
	function getOffset($el = document) {
		var elRect = $el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: elRect.top + scrollTop, left: elRect.left + scrollLeft };
	}
	//Inner navigation show/hide
	function bcInnerNav(navContainer) {
		/* 
			Does inner navigation show/hide 
			Works on the icon in inner nav elements which have dropdowns
			The argument is the navigaiton container
		*/
		const innerNavIcons = navContainer.querySelectorAll('.bc-inner-nav-icon');
		innerNavIcons.forEach((el, idx) => {
			function innerNavToggle(target, event, cb) {
				const thisDropdown = target.parentElement.querySelector('.bc-inner-nav-dropdown');
				const thisDropdownScrollHeight = thisDropdown.scrollHeight;
				if (thisDropdown.classList.contains('active')) {
					requestAnimationFrame(() => {
						thisDropdown.style.height = thisDropdownScrollHeight + 'px';
						requestAnimationFrame(() => {
							thisDropdown.style.height = 0;		
						});
					});
					thisDropdown.addEventListener('transitionend', function(e) {
						thisDropdown.removeEventListener('transitionend', arguments.callee) ;
						cb(thisDropdown);
					});

				} else {
					thisDropdown.addEventListener('transitionend', function(e) {
						thisDropdown.removeEventListener('transitionend', arguments.callee) ;
						thisDropdown.style.height = 'auto';
					});
					thisDropdown.style.height = thisDropdownScrollHeight + 'px';	
					cb(thisDropdown);
				}
			}
			el.addEventListener('click', (e) => {
				e.preventDefault();
				innerNavToggle(el, e, (dropdown) => {
					dropdown.classList.toggle('active');
				});
			});	
		}); 
	}//bcInnerNav()
	/** 
		container: 	DOM object
		image: 			media element - img, video
		*/
	function mediaFiller(container, image) {
		if (container.scrollWidth > image.scrollWidth) {
			image.style.width = container.scrollWidth+"px";
			image.style.height = 'auto';
		} else if (container.scrollHeight > image.scrollHeight) {
			image.style.height = container.scrollHeight+"px";
			image.style.width = 'auto';
		}
	}

	/** 
		toggler:  		DOM element: toggle trigger
		target: 			DOM element: toggle target
		activeClass: 	String: active class to add/remove
		callback: 		Callback function, gets the toggled element and the toggler
		*/
	function toggleVisibility(toggler, target, eventType, activeClass, callback) {
		if (toggler !== undefined && target !== undefined && eventType !== undefined) {
			toggler.addEventListener(eventType, () => {
				//
			});
		}
	} 
	/** 
		el:  					DOM element: class toggle target 
		className: 		String: active class to toggle
		callback: 		Callback function, get the el and the className on success
		*/
	function classToggle(el, classname, callback) {
		if ((el !== undefined && el instanceof Node) && (classname !== undefined && typeof classname === 'string')) {
			
			el.classList.toggle(classname);
			if (typeof callback == 'function') {
				callback(el, classname);
			}
		} else {
			throw new Error('Function classToggle requires: a HTML Node and a class name of type String');
		}
	} 

	/* CA custom Scripts */
	//Hero image on landing page - ensure it covers it's container
	if (window.outerWidth >= 900 && document.querySelectorAll('.bc-landing-hero')[0] !== undefined) {
		mediaFiller(document.querySelectorAll('.bc-landing-hero .bc-hero-image')[0], document.querySelectorAll('.bc-landing-hero .bc-hero-image img')[0]);
	}
	window.onresize = () => {
		if (window.outerWidth > 900 && document.querySelectorAll('.bc-landing-hero')[0] !== undefined) {
			mediaFiller(document.querySelectorAll('.bc-landing-hero .bc-hero-image')[0], document.querySelectorAll('.bc-landing-hero .bc-hero-image img')[0]);
		}
	};

	//Header menu showhide for mobile viewports
	const headerMenuToggle = document.querySelectorAll('.bc-header-menu__toggle')[0]; 
	headerMenuToggle.addEventListener('click', (e) => {
		classToggle(document.querySelectorAll('.bc-header-menu--show-hide')[0], 'menu-active');
	});

	//Flickity.js
	if (document.querySelector('.bc-hero--slider-slides')) {
		const elem = document.querySelector('.bc-hero--slider-slides');
		const flkty = new Flickity( elem, {
			pageDots: false,
			prevNextButtons: false,
			cellSelector: '.bc-hero--slider-slide',
			imagesLoaded: true
		});
		const slidesLength = flkty.slides.length;
		const slidesCount = document.querySelector('.bc-hero--slider .bc-hero--slider__counter .bc-hero--slider__counter__count');
		slidesCount.innerHTML = slidesLength;
		let currentSlide = 1;
		const slidesCurrentIdx = document.querySelector('.bc-hero--slider .bc-hero--slider__counter .bc-hero--slider__counter__current');
		slidesCurrentIdx.innerHTML = currentSlide;
		const sliderNext = document.querySelector('.bc-hero--slider__control--next');
		const sliderPrev = document.querySelector('.bc-hero--slider__control--prev');
		sliderPrev.classList.add('is-disabled'); 
		flkty.on('change', (idx) => {
			slidesCurrentIdx.innerHTML = idx + 1; 
			
			if (idx === 0) {
				sliderPrev.classList.toggle('is-disabled');
			} else if (idx === slidesLength - 1) {
				sliderNext.classList.toggle('is-disabled');
			} else if(sliderPrev.classList.contains('is-disabled')) {
				sliderPrev.classList.toggle('is-disabled');
			} else if(sliderNext.classList.contains('is-disabled')) {
				sliderNext.classList.toggle('is-disabled');
			}
		});
		sliderNext.addEventListener('click', (e) => {
			flkty.next();
		});
		sliderPrev.addEventListener('click', (e) => {
			flkty.previous();
		});
	}
	
	/* Landing hero carousel */
	if (document.querySelector('.bc-hero--landing-hero--carousel')) {
		const $landingHero = document.querySelector('.bc-hero--landing-hero--carousel');
		const $landingHeroCarousel = document.querySelector('.bc-hero--landing-hero--carousel .bc-hero__carousel');
		const $landingHeroControls = document.querySelector('.bc-hero__carousel__controls');
		const $landingHeroControls_next = $landingHeroControls.querySelector('.bc-hero__carousel__controls__next');
		const $landingHeroControls_prev = $landingHeroControls.querySelector('.bc-hero__carousel__controls__prev');
		
		const $landingHeroTitlesTrack = $landingHero.querySelector('.bc-hero__carousel__titles__track');
		const $landingHeroTitles = $landingHero.querySelectorAll('.bc-hero__carousel__title');
		const infoTextScrollWidth = $landingHero.querySelector('.bc-hero__carousel__info__text').scrollWidth;
		let carouselState = 'stopped';
		let landingHeroLength = 0;
		//States 
		
		const $landingHeroFlkty = new Flickity( $landingHeroCarousel, {
			pageDots: false,
			prevNextButtons: false,
			cellSelector: '.bc-hero__carousel__slide',
			imagesLoaded: true,
			autoPlay: true,
			wrapAround: false, 
			fade: true,
			setGallerySize: false,
			on: {
				ready: () => {
					$landingHeroControls.classList.add('is-playing');
					carouselState = 'playing';
					$landingHeroControls_prev.classList.add('.is-disabled');
					if (debug) {
						console.log(`Hero flkty playing ${$landingHeroControls.classList}`);
					} 
					$landingHeroTitlesTrack.style.width = infoTextScrollWidth * $landingHeroTitles.length + 'px';
					$landingHeroTitlesTrack.classList.remove('is-hidden');
					if (debug) {
						console.log(carouselState);
					}
				}
			}
		});
		landingHeroLength = $landingHeroFlkty.cells.length;
		if (debug) {
			console.log(`Hero flkty length ${landingHeroLength}`);
		} 
		
		$landingHeroControls_next.addEventListener('click', (evt) => {
			evt.preventDefault();
			$thisNext = evt.currentTarget;
			if ($thisNext.classList.contains('is-disabled') === false) {
				$landingHeroFlkty.next();
				if (carouselState === 'playing') {
					$landingHeroFlkty.pausePlayer();
					$landingHeroControls.classList.remove('is-playing');
					$landingHeroControls.classList.add('is-paused');
					carouselState = 'paused';	
				}
			}
		});
		$landingHeroControls_prev.addEventListener('click', (evt) => {
			evt.preventDefault();
			userClick = true;
			$thisPrev = evt.currentTarget;
			if ($thisPrev.classList.contains('is-disabled') === false) {
				$landingHeroFlkty.previous();
				if (carouselState === 'playing') {
					$landingHeroFlkty.pausePlayer();
					$landingHeroControls.classList.remove('is-playing');
					$landingHeroControls.classList.add('is-paused');
					carouselState = 'paused';	
				}
			}
		});
		let lastIdx = 0;
		$landingHeroFlkty.on('change', (idx) => {
			if (debug) {
				console.log(`Change idx: ${idx}`);
			}
			//Disable next.
			if (idx === landingHeroLength - 1) {
				$landingHeroControls_next.classList.add('is-disabled');
				$landingHeroControls_prev.classList.remove('is-disabled');
				if (carouselState === 'playing') {
					$landingHeroFlkty.pausePlayer();
					$landingHeroControls.classList.remove('is-playing');
					$landingHeroControls.classList.add('is-paused');
					carouselState = 'paused';	
				}
			} else if (idx === 0) {
				$landingHeroControls_prev.classList.add('is-disabled');
				$landingHeroControls_next.classList.remove('is-disabled');
				if (carouselState === 'playing') {
					$landingHeroFlkty.pausePlayer();
					$landingHeroControls.classList.remove('is-playing');
					$landingHeroControls.classList.add('is-paused');
					carouselState = 'paused';	
				}
			} else {
				$landingHeroControls_prev.classList.remove('is-disabled');
				$landingHeroControls_next.classList.remove('is-disabled');
			}
			if (debug) {
				console.log(carouselState);
			}
			requestAnimationFrame(() => {
				$landingHeroTitlesTrack.style.left = -infoTextScrollWidth * idx + 'px';
				return; 
			});
			//Disable prev.
		});
	}
	if (document.querySelector('.bc-hero--landing-hero--carousel.bc-design-process')) { 
		const elem = document.querySelector('.bc-hero--landing-hero--carousel.bc-design-process .bc-hero__carousel');
		const $designProcessFlkty = new Flickity( elem, {
			pageDots: false,
			prevNextButtons: false,
			cellSelector: '.bc-hero__carousel__slide',
			imagesLoaded: true,
			autoPlay: false,
			fade: true,
			setGallerySize: false
		});
		
		const $coverPlayLink = document.querySelector('.bc-hero-body-subtext > a');
		$coverPlayLink.addEventListener('click', (evt) => { 
			evt.preventDefault();
			$designProcessFlkty.select(1, false, false);
		});
		//Controls
		const $controlsPrev = document.querySelector('.bc-design-process .bc-hero__carousel__control--prev');
		$controlsPrev.addEventListener('click', (evt) => {
			evt.preventDefault();
			if ($designProcessFlkty.selectedIndex !== 0) {
				$designProcessFlkty.previous(false, false);	
				if ($designProcessFlkty.selectedIndex === 0) {
					evt.currentTarget.classList.add('is-disabled');
				}
			}
		});
		const $controlsNext = document.querySelector('.bc-design-process .bc-hero__carousel__control--next');
		$controlsNext.addEventListener('click', (evt) => {
			evt.preventDefault();
			if ($designProcessFlkty.selectedIndex !== $designProcessFlkty.cells.length -1) {
				$designProcessFlkty.next(false, false);	
				if ($designProcessFlkty.selectedIndex === $designProcessFlkty.cells.length -1) {
					evt.currentTarget.classList.add('is-disabled');
				}
			}
		});
		$designProcessFlkty.on('settle', (idx) => {
			console.log('change '+idx);
			if (idx !== 0) {
				document.querySelectorAll('.bc-hero__carousel__control')[0].classList.remove('is-hidden');
				document.querySelectorAll('.bc-hero__carousel__control')[1].classList.remove('is-hidden');
			} else {
				document.querySelectorAll('.bc-hero__carousel__control')[0].classList.add('is-hidden');
				document.querySelectorAll('.bc-hero__carousel__control')[1].classList.add('is-hidden');
			}
		});
	}
	/** 
		Global scroll events 
		*/
	const $topLink = document.querySelector('.page-bottom-links-top');
	window.addEventListener('scroll', (e) => {
		/* Page top links - float if scroll is > viewport height + 40px */
		function _isFooterVisible() {	
			return (detectScrollPosition() + window.innerHeight) >= document.querySelector('footer').offsetTop;
		}
		if (document.querySelector('.page-bottom-links-top')) {
			if (_isFooterVisible()) {
				if ($topLink.classList.contains('is-fixed')) {	
					//addClass('.page-bottom-links-top', 'is-hidden');	
					addClass($topLink, 'is-hidden');
					removeClass($topLink, 'is-fixed');
					setTimeout(() => {
							removeClass($topLink, 'is-hidden');
					}, 200);
				}
				return true;
			}
			if (detectScrollPosition() > window.innerHeight / 3) {
				if ($topLink.classList.contains('is-fixed') === false) {				
					addClass($topLink, 'is-hidden');
					addClass($topLink, 'is-fixed');
					setTimeout(() => {
						removeClass($topLink, 'is-hidden');
					}, 220);
					
				}
			} else if ($topLink.classList.contains('is-fixed')) {
				addClass($topLink, 'is-hidden');
				removeClass($topLink, 'is-fixed');
				setTimeout(() => {
						removeClass($topLink, 'is-hidden');
				}, 220);
			}
		}
	});//On page scroll
	
	/** 
		CA Projects: Load projects
		Project filters
		*/
	function writeCAProjects(projects, projectsFilter) { 
		/* Make a single card */
		function _makeCard(project) {
			//The card
			const projectCard = document.createElement('article');
			addClass(projectCard, 'bc-card--slide-up', 'bc-fade-in-up'); 
			for (let category of project.categories.split(', '))	 {
				projectCard.setAttribute('data-project-categories', category); 
			}
			//The image main image
			const cardImg = document.createElement('img');
			cardImg.setAttribute('src', project.image);
			cardImg.setAttribute('alt', project.title);
			
			const cardFigure = document.createElement('figure');
			addClass(cardFigure, 'bc-card-img', 'is-square');
			cardFigure.append(cardImg); 
			
			//The foucs image image
			const focusImg = document.createElement('img');
			focusImg.setAttribute('src', project.image);
			focusImg.setAttribute('alt', 'View ' + project.title);
			
			const focusFigure = document.createElement('figure');
			addClass(focusFigure, 'bc-card-img--focus-image', 'is-square');
			focusFigure.append(focusImg); 
			
			//Card content
			const cardContent = document.createElement('div');
			addClass(cardContent, 'bc-card-content');
			
			const cardLinkWrap = document.createElement('a');
			cardLinkWrap.setAttribute('href', project.projlink);
			
			//Card info
			const cardInfo = document.createElement('div');
			addClass(cardInfo, 'bc-card-info');
			const title = document.createElement('h2');
			title.append(project.title);
			addClass(title, 'bc-card-title');
			const subTitle = document.createElement('p');
			subTitle.append(project.location);
			addClass(subTitle, 'bc-card-subtitle');
			cardInfo.append(title);
			cardInfo.append(subTitle);
			
			//Content separator
			/*const contentSeparator = document.createElement('div');
			addClass(contentSeparator, 'content-separator');*/
			
			//Card link
			const cardLink = document.createElement('div');
			addClass(cardLink, 'bc-card-link');
			const cardLinkText = document.createElement('span');
			addClass(cardLinkText, 'bc-card-link-text');
			cardLinkText.append(project.linktext);
			
			//SVG Icon
			const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svgIcon.setAttribute('viewBox', '0 0 100 100');
			svgIcon.setAttribute('width', '100%');
			svgIcon.setAttribute('height', '100%');
			svgIcon.setAttribute('version', '1.1');
			svgIcon.setAttribute('style', 'enable-background:new 0 0 100 100;');
			svgIcon.setAttribute('xml:space', 'preserve');
			/*
				style="enable-background:new 0 0 100 100;" xml:space="preserve"
			*/
			addClass(svgIcon, 'svg-icon');
			const symbol = document.createElement('symbol');
			symbol.setAttribute('viewBox', '0 0 100 100');
			symbol.setAttribute('id', 'arrow');
			
			const titleEl = document.createElement('title');
			const titleText = document.createTextNode('Arrow icon');
			titleEl.append(titleText);
			const polygon = document.createElement('polygon');
			polygon.setAttribute('points', '89,47.4 67.2,25.7 71,22 99,50 71,78 67.2,74.3 89,52.6 1,52.6 1,47.4 ');
			svgIcon.append(titleEl, polygon);
			//svgIcon.append(symbol);
			cardLink.append(cardLinkText, svgIcon);
			
			//Append
			//cardLinkWrap.append(cardInfo, contentSeparator, cardLink);
			cardLinkWrap.append(cardInfo, cardLink);
			cardContent.append(cardLinkWrap);
			projectCard.append(cardFigure, focusFigure, cardContent);
			return projectCard;
			
		}//_makeCard()
		
		const $projectsGrid = document.querySelector('.ca-projects-grid');
		
		//Clear all cards in the page
		emptyElement($projectsGrid);
		$projectsGrid.style.minHeight = '100vh';
		if (projectsFilter === 'all-projects') {
			let newCards = [];
			let newCard = null;
			for (const project of projects) {
				newCard = _makeCard(project);
				$projectsGrid.append(newCard);
				newCards.push(newCard);
			}
			addClassTimed(newCards, 'bc-fade-in-up--loaded', 180);
		} else if (projectsFilter === 'project-category') {
			let categorizedProjects = [];
			for (const project of projects) {
				const thisProjectCategories = project.categoriestext.split(', ');
				for (const category in thisProjectCategories) {
					const thisCategory = categorizedProjects.find((elm) => {
						return elm.category === thisProjectCategories[category];
					});
					if (thisCategory !== undefined) {
						thisCategory.projects.push(project);
					} else {
						const newCat = {};
						newCat.category = thisProjectCategories[category];
						newCat.projects = [project];
						categorizedProjects.push(newCat);
					}
				}
			}
			/* 
				Write the projects by category
				*/
			for (const cat in categorizedProjects) {
				//<h1 class="ca-projects-filter-title">All projects</h1>
				const $catHeading = document.createElement('h1'); 
				$catHeading.append(categorizedProjects[cat].category);
				addClass($catHeading, 'ca-projects-filter-title', 'bc-fade-in-up');
				$projectsGrid.append($catHeading);
				addClassTimed($catHeading, 'bc-fade-in-up--loaded', 180);
				let newCards = [];
				for (const proj of categorizedProjects[cat].projects) {
					const newCard = _makeCard(proj);
					$projectsGrid.append(newCard);	
					newCards.push(newCard);
				}
				addClassTimed(newCards, 'bc-fade-in-up--loaded', 220);
				
			}
		} else if (projectsFilter === 'project-date') {
			console.log(`Filter by date`);
			let categorizedProjects = [];
			for (const project of projects) {
				const thisProjectYear = new Date(project.date);
				const thisCategory = categorizedProjects.find((elm) => {
					return elm.category.getUTCFullYear() === thisProjectYear.getUTCFullYear();
				});
				if (thisCategory !== undefined) {
					console.log(thisCategory);
					thisCategory.projects.push(project);
				} else {
					const newCat = {};
						console.log(thisProjectYear);
					newCat.category = thisProjectYear;
					newCat.projects = [project];
					categorizedProjects.push(newCat);
				}
			}
			categorizedProjects.sort((a, b) => {
				return b.category.getUTCFullYear() - a.category.getUTCFullYear();
			});
			for (const cat in categorizedProjects) {
				//<h1 class="ca-projects-filter-title">All projects</h1>
				const $catHeading = document.createElement('h1'); 
				$catHeading.append(categorizedProjects[cat].category.getUTCFullYear());
				addClass($catHeading, 'ca-projects-filter-title', 'bc-fade-in-up');
				$projectsGrid.append($catHeading);
				addClassTimed($catHeading, 'bc-fade-in-up--loaded', 180);
				let newCards = [];
				for (const proj of categorizedProjects[cat].projects) {
					const newCard = _makeCard(proj);
					$projectsGrid.append(newCard);	
					newCards.push(newCard);
				}
				addClassTimed(newCards, 'bc-fade-in-up--loaded', 220);
						
			}
		}//filter by date
	}//loadCAProject()
	/** 
		Global onload events 
		*/
	window.addEventListener('load', (evt) => {
		/* fade-in-up, up elements, mostly used on cards */
		if (document.querySelector('.bc-fade-in-up') !== null) {
			addClassTimed('.bc-fade-in-up', 'bc-fade-in-up--loaded', 160);	
		}
	});// window.onload
	
	const projectsFilter = 'all-projects';
	
	//the Projects grid
	function filterCAProjects(fltr) {
		/* https://new.cooneyarchitects.com/new-site/projects/projects.html*/
		/* http://localhost:9001/data/projects.json */
		return new Promise((resolve, reject) => {
			getJSON('http://localhost:9001/data/projects.json', {cache: 'no-cache'}).then((data) => {
				return data.json();
			}).then((projects) => {
				if (true) {
					//No cookie set
					//writeCAProjects(projects, fltr); 
				} else {
					//const projectFilter = 'project-category';	 //get cookie value
					//writeCAProjects(projects, fltr);
				}
				resolve(true);
			}).catch((err) => {
				reject(err);
			});//getJSON	
		});
	}
	function _getProjectFilter(evt) { 
		return evt.currentTarget.getAttribute('data-filter');
	} 
	
	if ((_getDOMNode('.ca-projects-grid') || _getDOMNode('.bc-cards-row')) && _getDOMNode('.ca-project-filters') ) {
		/* Set up project filters */
		const $projectFilters = _getDOMNode('.ca-project-filters');
		const $projectFiltersList = _getDOMNode('.ca-project-filters__list');
		const $breadcrumbs = _getDOMNode('.bc-breadcrumbs');
		const $breadcrumbsContainer = $breadcrumbs.closest('.bc-breadcrumbs-container');
		const breadcrumbsContainerHeight = $breadcrumbs.clientHeight;
		const breadcrumbsHeight = $breadcrumbs.clientHeight;
		const projectFiltersHeight = $projectFilters.scrollHeight;
		
		if (debug) {
			console.log('start projects filter init');
		}
	
			if (debug) {
				console.log('Window < 768px');
			}
			const filtersTogglers = Array.from(document.querySelectorAll('.ca-project-filters__label, .ca-project-filters__show-hide'));
			filtersTogglers.forEach((filtersToggler, idx) => {
				filtersToggler.addEventListener('click', (event) => {
					if (debug) {
						console.log(`click filtersToggler`);	
					}
					if (hasClass(filtersToggler, 'is-active')) {
						adjustHeight($projectFilters, 0, 0.2, () => {
							requestAnimationFrame(() => {
								addClass($projectFiltersList, 'is-invisible');
								removeClass(filtersToggler, 'is-active');
							});	
						});
						
					} else {
						adjustHeight($projectFilters, projectFiltersHeight, 0.2, () => {
							requestAnimationFrame(() => {
								removeClass($projectFiltersList, 'is-invisible');
								addClass(filtersToggler, 'is-active');
							});	
						});
						
					}
				});
			});
	
		filterCAProjects('all-projects'); 
		const projectFilters = _getAllDOMNodes('.ca-project-filter');
		
		projectFilters.forEach((filter) => {
			filter.addEventListener('click', (event) => {
				filterCAProjects(_getProjectFilter(event)).then(() => {
					console.log('then');
					projectFilters.forEach((el) => {
						removeClass(el, 'active');
					});
					addClass(event.target, 'active');
				}).catch((err) => {
					console.log(err);
				});
			});											 
		});
		
	}//end if .ca-projects-grid
	window.onload =  (e) => {
		//Scroll to #page-section
		if (location.hash !== '') {
			requestAnimationFrame(() => {
				lerpScroll(window, window.pageYOffset, getOffset(document.querySelector(location.hash)).top);
			});
			console.log('window Y offset: '+window.pageYOffset);
		}
		//Back to previous page
		if (document.querySelector('.is-inner-page')) {
			const $backLink = document.querySelector('.page-bottom-links-back-link');
			$backLink.setAttribute('href', document.referrer);
		}
		const $pageScrollers = (document.querySelectorAll('.is-page-scroll')) ? Array.from(document.querySelectorAll('.is-page-scroll')) : null ;
		if ($pageScrollers && $pageScrollers.length > 0) {
			$pageScrollers.forEach(($link, idx) => {
				$link.addEventListener('click', (evt) => {
					evt.preventDefault();
					console.log(getOffset($link).top);
					const $parentHero = $link.closest('.bc-content-container');
					const $nextSection = $parentHero.nextElementSibling;
					lerpScroll(window, window.scrollY, getOffset(document.querySelector($link.getAttribute('href'))).top, 0.025);
				});
			});
		}
		//Hero scroll link
		
		const $heroScrollLinks = (document.querySelectorAll('.bc-hero-footer__scroll > a, .bc-feature-footer__scroll > a')) ? Array.from(document.querySelectorAll('.bc-hero-footer__scroll, .bc-feature-footer__scroll > a')) : null ;
		if (debug){
			console.log(`${$heroScrollLinks.length} scroll links found`);
		}
		if ($heroScrollLinks && $heroScrollLinks.length > 0) {
			$heroScrollLinks.forEach(($link, idx) => {
				$link.addEventListener('click', (evt) => {
					if (debug){
						console.log(`$heroScrollLink click`);
					}
					evt.preventDefault();
					console.log(getOffset($link).top);
					const $parentHero = $link.closest('.bc-content-container');
					const $nextSection = $parentHero.nextElementSibling;
					lerpScroll(window, window.scrollY, getOffset($nextSection).top, 0.025);
				});
			});
		}
		//Back to the top of the page
		const $topLink = (document.querySelectorAll('.page-bottom-links-top-link')) ? document.querySelector('.page-bottom-links-top-link') : null ;
		if ($topLink) {
			$topLink.addEventListener('click', (evt) => {
				evt.preventDefault();
				console.log(window.pageXOffset);
				lerpScroll(window, window.scrollY, 0, 0.025);
			});
		}
	};
})();


