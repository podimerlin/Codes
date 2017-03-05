/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactBootstrap = __webpack_require__(3);

	var _reactBootstrap2 = _interopRequireDefault(_reactBootstrap);

	var _reactBootstrapTypeahead = __webpack_require__(4);

	var _reactBootstrapTypeahead2 = _interopRequireDefault(_reactBootstrapTypeahead);

	var _Highlight = __webpack_require__(5);

	var _Gmap = __webpack_require__(6);

	var _Gmap2 = _interopRequireDefault(_Gmap);

	var _Marker = __webpack_require__(8);

	var _Marker2 = _interopRequireDefault(_Marker);

	var _InfoWindow = __webpack_require__(9);

	var _InfoWindow2 = _interopRequireDefault(_InfoWindow);

	var _SidebarUser = __webpack_require__(11);

	var _SidebarUser2 = _interopRequireDefault(_SidebarUser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var baseHref = $('base').attr('href');

	var App = function (_Component) {
		_inherits(App, _Component);

		function App(props) {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

			_this.handleOpenSidebarUser = _this.handleOpenSidebarUser.bind(_this);
			_this.handleCloseSidebarUser = _this.handleCloseSidebarUser.bind(_this);
			_this.handleMapClick = _this.handleMapClick.bind(_this);
			_this.handleMarkerMouseover = _this.handleMarkerMouseover.bind(_this);
			_this.handleMarkerMouseout = _this.handleMarkerMouseout.bind(_this);
			_this.handleMarkerClick = _this.handleMarkerClick.bind(_this);
			_this.handleMarkerDragend = _this.handleMarkerDragend.bind(_this);
			_this._handleTypeaheadChange = _this._handleTypeaheadChange.bind(_this);
			_this._handleTypeaheadInputChange = _this._handleTypeaheadInputChange.bind(_this);
			_this._handleTypeaheadSubmit = _this._handleTypeaheadSubmit.bind(_this);
			_this.handleChangeAvatar = _this.handleChangeAvatar.bind(_this);
			_this.handleHashtagFormSubmit = _this.handleHashtagFormSubmit.bind(_this);
			_this.handleLoginSubmit = _this.handleLoginSubmit.bind(_this);
			_this.handleRegisterSubmit = _this.handleRegisterSubmit.bind(_this);

			_this.openModalSignIn = _this.openModalSignIn.bind(_this);
			_this.openModalSignUp = _this.openModalSignUp.bind(_this);
			_this.closeAllModals = _this.closeAllModals.bind(_this);

			_this.state = {
				center: {
					lat: 1.3520865,
					lng: 103.8599104
				},
				currentUser: null,
				currentMarkers: [],
				publicMarkers: [],
				selectedPlace: {},
				activeMarker: {},
				showInfoBox: false,
				showSidebarUser: false,
				showModalSignIn: false,
				showModalSignUp: false,
				typeaheadData: [],
				hideemail: false
			};
			return _this;
		}

		_createClass(App, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.initializeData();
			}
		}, {
			key: 'initializeData',
			value: function initializeData() {
				$.ajax({
					url: '/api/index',
					method: 'get',
					dataType: 'json',
					success: function (data) {
						this.setState({
							currentMarkers: data.markers,
							publicMarkers: data.markers,
							currentUser: data.currentUser
						});
					}.bind(this),
					error: function error(xhr, status, err) {
						console.error(xhr, status, err.toString());
					}
				});
			}
		}, {
			key: 'loadPublicMarkersFromServer',
			value: function loadPublicMarkersFromServer(obj) {
				var str = [];
				for (var p in obj) {
					if (obj.hasOwnProperty(p)) {
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
				}

				var url = '/api/markers?' + str.join("&");console.log(url);
				$.ajax({
					url: url,
					method: 'get',
					dataType: 'json',
					cache: false,
					success: function (data) {
						this.setState({ currentMarkers: data, publicMarkers: data });
					}.bind(this),
					error: function error(xhr, status, err) {
						console.error(xhr, status, err.toString());
					}
				});
			}
		}, {
			key: 'displayPublicMarkers',
			value: function displayPublicMarkers() {
				var markers = this.state.publicMarkers;
				this.setState({ currentMarkers: markers });
			}
		}, {
			key: 'displayUserMarker',
			value: function displayUserMarker() {
				var markers = [];
				markers.push(this.state.currentUser);
				this.setState({
					center: {
						lat: this.state.currentUser.lat,
						lng: this.state.currentUser.lng
					},
					currentMarkers: markers
				});
			}
		}, {
			key: 'scrollTo',
			value: function scrollTo(el, offeset) {
				var pos = el && el.size() > 0 ? el.offset().top : 0;

				if (el) {
					pos = pos + (offeset ? offeset : -1 * el.height());
				}

				$('html,body').animate({
					scrollTop: pos
				}, 'slow');
			}
		}, {
			key: 'handleMapClick',
			value: function handleMapClick(props, map, e) {
				if (this.state.showInfoBox) {
					this.setState({
						showInfoBox: false,
						activeMarker: null
					});
				}
			}
		}, {
			key: 'handleMarkerMouseover',
			value: function handleMarkerMouseover(props, marker, e) {
				if (props.type != 'public') return;
				marker.set('labelClass', 'dawmap-thumb-label hover');
			}
		}, {
			key: 'handleMarkerMouseout',
			value: function handleMarkerMouseout(props, marker, e) {
				if (props.type != 'public') return;
				marker.set('labelClass', 'dawmap-thumb-label');
			}
		}, {
			key: 'handleMarkerClick',
			value: function handleMarkerClick(props, marker, e) {
				if (props.type != 'public') return;

				this.setState({
					center: {
						lat: props.position.lat,
						lng: props.position.lng
					},
					selectedPlace: props,
					activeMarker: marker,
					showInfoBox: true
				});
			}
		}, {
			key: 'handleMarkerDragend',
			value: function handleMarkerDragend(props, marker, e) {
				var url = '/user/update-position';
				var lat = marker.getPosition().lat();
				var lng = marker.getPosition().lng();

				$.ajax({
					type: "POST",
					url: url,
					data: { lat: lat, lng: lng },
					success: function (response, status, xhr) {
						this.state.currentUser.lat = lat;
						this.state.currentUser.lng = lng;
						var markers = [];
						markers.push(this.state.currentUser);
						this.setState({ currentMarkers: markers });
					}.bind(this)
				});
			}
		}, {
			key: '_handleTypeaheadChange',
			value: function _handleTypeaheadChange(e) {
				if (e.length > 0) {
					this.loadPublicMarkersFromServer(e[0]);
				} else {
					this.loadPublicMarkersFromServer({});
				}
			}
		}, {
			key: '_handleTypeaheadInputChange',
			value: function _handleTypeaheadInputChange(e) {
				var url = '/api/autocomplete?q=' + encodeURIComponent(e);

				$.ajax({
					type: "GET",
					url: url,
					success: function (response, status, xhr) {
						this.setState({ typeaheadData: response });
					}.bind(this)
				});
			}
		}, {
			key: '_handleTypeaheadSubmit',
			value: function _handleTypeaheadSubmit() {
				var e = this.refs.typeahead.getInstance();
				if (e.length > 0) {
					this.loadPublicMarkersFromServer({
						'type': 'keyword',
						'name': e.state.text
					});
				} else {
					this.loadPublicMarkersFromServer({});
				}
			}
		}, {
			key: 'handleOpenSidebarUser',
			value: function handleOpenSidebarUser() {
				if (this.state.currentUser === null) return;
				if (this.state.currentUser === false) {
					this.openModalSignIn();
					return;
				}

				$('body').addClass('page-quick-sidebar-right-open');
				this.setState({ currentMarkers: [], showSidebarUser: true, showInfoBox: false, activeMarker: null });

				this.displayUserMarker();
			}
		}, {
			key: 'handleCloseSidebarUser',
			value: function handleCloseSidebarUser() {
				$('body').removeClass('page-quick-sidebar-right-open');
				this.setState({ currentMarkers: [], showSidebarUser: false });
				this.loadPublicMarkersFromServer({});
				this.displayPublicMarkers();
			}
		}, {
			key: 'closeAllModals',
			value: function closeAllModals() {
				this.setState({ showModalSignIn: false, showModalSignUp: false });
			}
		}, {
			key: 'openModalSignIn',
			value: function openModalSignIn() {
				if (this.state.currentUser) return;
				this.setState({ showModalSignIn: true, showModalSignUp: false });
			}
		}, {
			key: 'openModalSignUp',
			value: function openModalSignUp() {
				if (this.state.currentUser) return;
				this.setState({ showModalSignIn: false, showModalSignUp: true });
			}
		}, {
			key: 'handleChangeAvatar',
			value: function handleChangeAvatar(dataURI) {
				var b64Data = dataURI.replace("data:image\/png;base64,", "").replace("data:image/jpeg;base64,", "");
				var blob = this.base64ToBlob(b64Data, "image/png");

				var formData = new FormData();
				formData.append('avatar', blob, "cropped.png");

				$.ajax({
					url: '/user/change-avatar',
					type: "POST",
					cache: false,
					contentType: false,
					processData: false,
					data: formData
				}).done(function (response) {});
			}
		}, {
			key: 'handleHashtagFormSubmit',
			value: function handleHashtagFormSubmit(form) {
				form.find('button').attr('disabled', true).text('Saving...');
				$.ajax({
					type: "POST",
					url: '/user/update-description',
					data: form.serialize(),
					success: function success(response, status, xhr) {
						form.find('button').attr('disabled', false).toggleClass('green-jungle').text('Saved');

						setTimeout(function () {
							form.find('button').toggleClass('green-jungle').text('Save');
						}, 1000);
					}
				});
			}
		}, {
			key: 'handleLoginSubmit',
			value: function handleLoginSubmit(e) {
				e.preventDefault();

				var $form = $(this.refs.loginForm);
				$form.find('button').attr('disabled', true);
				$form.find('.alert').hide();
				$.ajax({
					type: "POST",
					url: '/user/login-ajax',
					data: $form.serialize(),
					success: function (response, status, xhr) {
						$form.find('button').attr('disabled', false);
						if (response.status == 'error') {
							$form.find('.alert').fadeIn();
							this.scrollTo($form);
						} else if (response.status = 'OK') {
							this.setState({ currentUser: response.user });
							this.closeAllModals();
							this.handleOpenSidebarUser();
						}
					}.bind(this)
				});
			}
		}, {
			key: 'handleRegisterSubmit',
			value: function handleRegisterSubmit(e) {
				e.preventDefault();

				var $form = $(this.refs.registerForm);
				$form.find('.form-group').removeClass('has-error');
				$form.find('.help-block').remove();
				$form.find('button').attr('disabled', true);
				$.ajax({
					type: "POST",
					url: '/user/register',
					data: $form.serialize(),
					success: function (response, status, xhr) {
						$form.find('button').attr('disabled', false);
						if (response.status == 'error') {
							$.each(response.msg, function (n, err) {
								$form.find('div[data-for="' + n + '"]').addClass('has-error');
								$.each(err, function (c, m) {
									$form.find('div[data-for="' + n + '"]').append('<div class="help-block">' + m + '</div>');
								});
							});
						} else {
							location.reload();
						}
					}.bind(this)
				});
			}
		}, {
			key: 'base64ToBlob',
			value: function base64ToBlob(base64, mime) {
				mime = mime || '';
				var sliceSize = 1024;
				var byteChars = window.atob(base64);
				var byteArrays = [];

				for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
					var slice = byteChars.slice(offset, offset + sliceSize);

					var byteNumbers = new Array(slice.length);
					for (var i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					var byteArray = new Uint8Array(byteNumbers);

					byteArrays.push(byteArray);
				}

				return new Blob(byteArrays, { type: mime });
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				var typeaheadProps = {
					align: 'justify',
					alignMenu: false,
					allowNew: false,
					bsSize: undefined,
					caseSensitive: false,
					disabled: false,
					dropup: false,
					emptyLabel: 'Search Dawmap',
					labelKey: "name",
					maxHeight: 500,
					maxResults: 10,
					minLength: 1,
					multiple: false,
					name: "q",
					largeDataSet: false,
					preSelected: false,
					text: '',
					placeholder: 'Search',
					customMenuItemChildren: false,
					customToken: false,
					selected: [],
					ref: 'typeahead'
				};

				var markerNodes = this.state.currentMarkers.map(function (marker) {
					var pos = { lat: marker.lat, lng: marker.lng };
					var icon = marker.type == 'public' ? baseHref + '/assets/img/marker.png' : baseHref + '/assets/img/marker-draggable.png';

					var description = marker.description.replace(/<br[^>]*>/g, "");
					marker.description = description;

					return _react2.default.createElement(_Marker2.default, {
						id: marker.id,
						type: marker.type,
						position: pos,
						icon: icon,
						thumb: marker.thumb,
						displayName: marker.displayName,
						email: marker.email,
						hashtags: marker.hashtags,
						description: marker.description,
						onMouseover: this.handleMarkerMouseover,
						onMouseout: this.handleMarkerMouseout,
						onClick: this.handleMarkerClick,
						onDragend: this.handleMarkerDragend
					});
				}.bind(this));

				var hashTagNodes = $.isEmptyObject(this.state.selectedPlace) ? null : this.state.selectedPlace.hashtags.map(function (tag) {
					return _react2.default.createElement(
						'a',
						{ href: 'javascript:;' },
						'#',
						tag
					);
				});

				return _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'div',
						{ id: 'header' },
						_react2.default.createElement(
							'div',
							{ className: 'header-inner' },
							_react2.default.createElement(
								'form',
								{ className: 'search-form' },
								_react2.default.createElement(
									'div',
									{ className: 'search-form-inner' },
									_react2.default.createElement(
										'span',
										{ className: 'sidebar-toggler' },
										_react2.default.createElement('span', { 'aria-hidden': 'true' })
									),
									_react2.default.createElement(_reactBootstrapTypeahead2.default, _extends({}, typeaheadProps, {
										onChange: this._handleTypeaheadChange,
										onInputChange: this._handleTypeaheadInputChange,
										options: this.state.typeaheadData,
										renderMenuItemChildren: function renderMenuItemChildren(props, option, idx) {
											return [_react2.default.createElement(
												'span',
												{ className: 'search-result-type' },
												_react2.default.createElement('i', { className: 'fa fa-hashtag' })
											), _react2.default.createElement(
												'span',
												{ className: 'search-result-body' },
												_react2.default.createElement(
													'span',
													{ className: 'search-result-label' },
													_react2.default.createElement('span', { key: 'name', dangerouslySetInnerHTML: { __html: (0, _Highlight.highlight)(option.name, _this2.refs.typeahead.getInstance().state.text) } })
												),
												_react2.default.createElement(
													'span',
													{ className: 'search-result-total' },
													_react2.default.createElement(
														'span',
														{ key: 'total' },
														option.total,
														' people(s) matched'
													)
												)
											)];
										}
									})),
									_react2.default.createElement(
										'span',
										{ className: 'search-form-submit' },
										_react2.default.createElement(
											'button',
											{ type: 'button', onClick: this._handleTypeaheadSubmit, className: 'btn btn-submit' },
											_react2.default.createElement('i', { className: 'icon-search' })
										)
									)
								)
							),
							_react2.default.createElement(
								'div',
								{ id: 'logo' },
								_react2.default.createElement(
									'a',
									{ href: '/' },
									_react2.default.createElement('img', { src: 'assets/img/logo.png' })
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'map-wrapper' },
						_react2.default.createElement(
							_Gmap2.default,
							{ center: this.state.center, onClick: this.handleMapClick },
							markerNodes,
							_react2.default.createElement(
								_InfoWindow2.default,
								{ marker: this.state.activeMarker, visible: this.state.showInfoBox },
								_react2.default.createElement(
									'div',
									{ className: 'user-summary-wrap' },
									_react2.default.createElement(
										'div',
										{ className: 'user-summary-inner clearfix' },
										_react2.default.createElement(
											'div',
											{ className: 'user-summary-thumb' },
											_react2.default.createElement('img', { src: this.state.selectedPlace.thumb })
										),
										_react2.default.createElement(
											'div',
											{ className: 'user-summary-info ' },
											_react2.default.createElement(
												'h3',
												null,
												this.state.selectedPlace.displayName
											),
											_react2.default.createElement(
												'div',
												{ className: 'e-wrap', title: this.state.selectedPlace.email },
												_react2.default.createElement('i', { className: 'fa fa-envelope' }),
												' ',
												this.state.selectedPlace.email
											),
											_react2.default.createElement(
												'div',
												{ className: 'hashtags' },
												this.state.selectedPlace.description
											)
										)
									)
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ id: 'quick-sidebar-right-toggler', onClick: this.handleOpenSidebarUser },
						_react2.default.createElement('span', null)
					),
					this.state.currentUser && _react2.default.createElement(_SidebarUser2.default, {
						thumb: this.state.currentUser.thumb,
						displayName: this.state.currentUser.displayName,
						email: this.state.currentUser.email,
						description: this.state.currentUser.description,
						onChangeAvatar: this.handleChangeAvatar,
						onHashtagFormSubmit: this.handleHashtagFormSubmit,
						onCloseSidebarUser: this.handleCloseSidebarUser
					}),
					!this.state.currentUser && _react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							_reactBootstrap.Modal,
							{ bsClass: 'modal', bsSize: 'sm', show: this.state.showModalSignIn, onHide: this.closeAllModals },
							_react2.default.createElement(_reactBootstrap.Modal.Header, { closeButton: true }),
							_react2.default.createElement(
								_reactBootstrap.Modal.Body,
								null,
								_react2.default.createElement(
									'form',
									{ onSubmit: this.handleLoginSubmit, ref: 'loginForm', className: 'login-form' },
									_react2.default.createElement(
										'h4',
										{ className: 'text-center sbold mb-20' },
										'Log In'
									),
									_react2.default.createElement(
										'div',
										{ className: 'alert alert-danger display-none' },
										'Invalid email address/password'
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-envelope' }),
											_react2.default.createElement('input', { name: 'identity', className: 'form-control', type: 'text', placeholder: 'Email Address', required: 'true' })
										)
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-lock' }),
											_react2.default.createElement('input', { name: 'credential', className: 'form-control', type: 'password', placeholder: 'Password', required: 'true' })
										)
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-actions mb-15' },
										_react2.default.createElement(
											'label',
											{ className: 'rememberme mt-checkbox mt-checkbox-outline' },
											_react2.default.createElement('input', { type: 'checkbox', name: 'remember', value: '1' }),
											' Remember me',
											_react2.default.createElement('span', null)
										),
										_react2.default.createElement(
											'a',
											{ href: 'javascript:;', className: 'pull-right' },
											'Forgot Password?'
										),
										_react2.default.createElement(
											'button',
											{ type: 'submit', className: 'btn btn-block btn-md blue-steel sbold' },
											'Login'
										)
									),
									_react2.default.createElement(
										'p',
										{ className: 'text-center' },
										'No account? ',
										_react2.default.createElement(
											'a',
											{ onClick: this.openModalSignUp.bind(this), href: 'javascript:;', className: 'font-blue-steel' },
											'Create a Dawmap account'
										)
									)
								)
							)
						),
						_react2.default.createElement(
							_reactBootstrap.Modal,
							{ bsClass: 'modal', bsSize: 'sm', show: this.state.showModalSignUp, onHide: this.closeAllModals },
							_react2.default.createElement(_reactBootstrap.Modal.Header, { closeButton: true }),
							_react2.default.createElement(
								_reactBootstrap.Modal.Body,
								null,
								_react2.default.createElement(
									'form',
									{ ref: 'registerForm', onSubmit: this.handleRegisterSubmit.bind(this), className: 'register-form', autocomplete: 'off' },
									_react2.default.createElement(
										'h4',
										{ className: 'text-center sbold mb-20' },
										'Sign Up'
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group', 'data-for': 'email' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-envelope' }),
											_react2.default.createElement('input', { className: 'form-control', type: 'text', placeholder: 'Email Address', name: 'email', required: 'true' })
										)
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group', 'data-for': 'display_name' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-user' }),
											_react2.default.createElement('input', { className: 'form-control', type: 'text', placeholder: 'Display Name', name: 'display_name', required: 'true' })
										)
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group', 'data-for': 'password' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-lock' }),
											_react2.default.createElement('input', { className: 'form-control', type: 'password', placeholder: 'Password', name: 'password', required: 'true' })
										)
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-group', 'data-for': 'passwordVerify' },
										_react2.default.createElement(
											'div',
											{ className: 'input-icon' },
											_react2.default.createElement('i', { className: 'icon-check' }),
											_react2.default.createElement('input', { className: 'form-control', type: 'password', placeholder: 'Confirm Password', name: 'passwordVerify', required: 'true' })
										)
									),
									_react2.default.createElement(
										'p',
										{ className: 'text-center' },
										'By creating an account you agree to our ',
										_react2.default.createElement(
											'a',
											{ href: 'javascript:;' },
											'Terms and Conditions'
										),
										' and our ',
										_react2.default.createElement(
											'a',
											{ href: 'javascript:;' },
											'Privacy Policy'
										),
										'.'
									),
									_react2.default.createElement(
										'div',
										{ className: 'form-actions mb-15' },
										_react2.default.createElement(
											'button',
											{ type: 'submit', className: 'btn btn-block btn-md blue-steel sbold' },
											'Signup'
										),
										_react2.default.createElement(
											'div',
											{ className: 'or-separate' },
											_react2.default.createElement(
												'span',
												null,
												'or'
											)
										),
										_react2.default.createElement(
											'a',
											{ href: 'javascript:;', type: 'button', className: 'btn btn-block btn-md blue-steel sbold' },
											_react2.default.createElement('i', { className: 'fa fa-facebook' }),
											' Signup with Facebook'
										)
									),
									_react2.default.createElement(
										'p',
										{ className: 'text-center' },
										'Already have an account? ',
										_react2.default.createElement(
											'a',
											{ onClick: this.openModalSignIn.bind(this), href: 'javascript:;', className: 'font-blue-steel' },
											'Login'
										)
									)
								)
							)
						)
					)
				);
			}
		}]);

		return App;
	}(_react.Component);

	(0, _reactDom.render)(_react2.default.createElement(App, null), document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactBootstrap;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = ReactBootstrapTypeahead;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var highlight = exports.highlight = function highlight(bodyText, searchTerm, highlightStartTag, highlightEndTag) {
		// the highlightStartTag and highlightEndTag parameters are optional
		if (!highlightStartTag || !highlightEndTag) {
			highlightStartTag = "<strong>";
			highlightEndTag = "</strong>";
		}

		// find all occurences of the search term in the given text,
		// and add some "highlight" tags to them (we're not using a
		// regular expression search, because we want to filter out
		// matches that occur within HTML tags and script blocks, so
		// we have to do a little extra validation)
		var newText = "";
		var i = -1;
		var lcSearchTerm = searchTerm.toLowerCase();
		var lcBodyText = bodyText.toLowerCase();

		while (bodyText.length > 0) {
			i = lcBodyText.indexOf(lcSearchTerm, i + 1);
			if (i < 0) {
				newText += bodyText;
				bodyText = "";
			} else {
				// skip anything inside an HTML tag
				if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
					// skip anything inside a <script> block
					if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
						newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
						bodyText = bodyText.substr(i + searchTerm.length);
						lcBodyText = bodyText.toLowerCase();
						i = -1;
					}
				}
			}
		}

		return newText;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _String = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var evtNames = ['ready', 'click', 'dragend', 'recenter'];

	var GMap = function (_Component) {
		_inherits(GMap, _Component);

		function GMap(props) {
			_classCallCheck(this, GMap);

			var _this = _possibleConstructorReturn(this, (GMap.__proto__ || Object.getPrototypeOf(GMap)).call(this, props));

			_this.listeners = {};

			var _this$props$initialCe = _this.props.initialCenter;
			var lat = _this$props$initialCe.lat;
			var lng = _this$props$initialCe.lng;

			_this.state = {
				currentLocation: {
					lat: lat,
					lng: lng
				}
			};
			return _this;
		}

		_createClass(GMap, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.loadMap();
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps, prevState) {
				if (prevProps.map !== this.props.map) {
					this.loadMap();
				}

				if (this.props.center !== prevProps.center) {
					this.setState({
						currentLocation: this.props.center
					});
				}

				if (prevState.currentLocation !== this.state.currentLocation) {
					this.recenterMap();
				}
			}
		}, {
			key: 'loadMap',
			value: function loadMap() {
				var _this2 = this;

				var _props = this.props;
				var zoom = _props.zoom;
				var draggable = _props.draggable;


				var maps = google.maps;
				var mapRef = this.refs.mapCanvas;
				var node = ReactDOM.findDOMNode(mapRef);
				var curr = this.state.currentLocation;
				var center = new google.maps.LatLng(curr.lat, curr.lng);

				var mapOptions = {
					zoom: zoom,
					center: center,
					draggable: draggable
				};
				this.map = new google.maps.Map(node, mapOptions);

				evtNames.forEach(function (e) {
					_this2.listeners[e] = _this2.map.addListener(e, _this2.handleEvent(e));
				});
				maps.event.trigger(this.map, 'ready');

				this.forceUpdate();
			}
		}, {
			key: 'handleEvent',
			value: function handleEvent(evtName) {
				var _this3 = this;

				var timeout = void 0;
				var handlerName = 'on' + (0, _String.camelize)(evtName);

				return function (e) {
					if (timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					timeout = setTimeout(function () {
						if (_this3.props[handlerName]) {
							_this3.props[handlerName](_this3.props, _this3.map, e);
						}
					}, 0);
				};
			}
		}, {
			key: 'recenterMap',
			value: function recenterMap() {
				var map = this.map;

				var maps = google.maps;

				if (map) {
					var center = this.state.currentLocation;
					if (!(center instanceof google.maps.LatLng)) {
						center = new google.maps.LatLng(center.lat, center.lng);
					}

					map.setCenter(center);
					map.panTo(center);
				}
			}
		}, {
			key: 'renderChildren',
			value: function renderChildren() {
				var _this4 = this;

				var children = this.props.children;


				if (!children) return;

				return _react2.default.Children.map(children, function (c) {
					return _react2.default.cloneElement(c, {
						map: _this4.map,
						mapCenter: _this4.state.currentLocation
					});
				});
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'div',
					{ className: 'map-canvas', ref: 'mapCanvas' },
					'Loading map...',
					this.renderChildren()
				);
			}
		}]);

		return GMap;
	}(_react.Component);

	GMap.propTypes = {
		map: _react.PropTypes.object,
		center: _react.PropTypes.object,
		initialCenter: _react.PropTypes.object,
		zoom: _react.PropTypes.number,
		draggable: _react.PropTypes.boolean
	};
	GMap.defaultProps = {
		center: {},
		initialCenter: {
			lat: 1.3520865,
			lng: 103.8599104
		},
		zoom: 13,
		draggable: true
	};
	exports.default = GMap;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var camelize = exports.camelize = function camelize(str) {
		return str.split(' ').map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}).join('');
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _String = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var evtNames = ['mouseover', 'mouseout', 'click', 'dragend'];

	var Marker = function (_Component) {
		_inherits(Marker, _Component);

		function Marker(props) {
			_classCallCheck(this, Marker);

			return _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this, props));
		}

		_createClass(Marker, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.renderMarker();
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps) {
				if (this.props.map !== prevProps.map || this.props.position !== prevProps.position) {
					this.marker.setMap(null);
					this.renderMarker();
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				if (this.marker) {
					this.marker.setMap(null);
				}
			}
		}, {
			key: 'renderMarker',
			value: function renderMarker() {
				var _this2 = this;

				var _props = this.props;
				var map = _props.map;
				var mapCenter = _props.mapCenter;
				var type = _props.type;
				var position = _props.position;
				var icon = _props.icon;
				var thumb = _props.thumb;


				var pos = position || mapCenter;

				var latlng = new google.maps.LatLng(pos.lat, pos.lng);

				var iconImage = void 0,
				    draggable = void 0,
				    labelAnchor = void 0,
				    labelClass = void 0,
				    labelContent = void 0;
				if (type == 'user') {
					iconImage = {
						url: icon,
						size: new google.maps.Size(44, 52),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(22, 52)
					};
					draggable = true;
					labelAnchor = new google.maps.Point(0, 0);
					labelClass = 'dawmap-label';
					labelContent = 'Move to where <br />you want your text to be';
				} else {
					iconImage = {
						url: icon,
						size: new google.maps.Size(50, 57),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(25, 57)
					};
					draggable = false;
					labelAnchor = new google.maps.Point(25, 57);
					labelClass = 'dawmap-thumb-label';
					labelContent = '<div><img src="' + thumb + '" /></div>';
				}

				var pref = {
					map: map,
					position: latlng,
					icon: iconImage,
					draggable: draggable,
					labelClass: labelClass,
					labelContent: labelContent,
					labelAnchor: labelAnchor,
					labelInBackground: true,
					raiseOnDrag: false
				};

				this.marker = new MarkerWithLabel(pref);

				evtNames.forEach(function (e) {
					_this2.marker.addListener(e, _this2.handleEvent(e));
				});
			}
		}, {
			key: 'handleEvent',
			value: function handleEvent(evt) {
				var _this3 = this;

				return function (e) {
					var evtName = 'on' + (0, _String.camelize)(evt);
					if (_this3.props[evtName]) {
						_this3.props[evtName](_this3.props, _this3.marker, e);
					}
				};
			}
		}, {
			key: 'render',
			value: function render() {
				return null;
			}
		}]);

		return Marker;
	}(_react.Component);

	Marker.propTypes = {
		id: _react.PropTypes.number,
		map: _react.PropTypes.object,
		mapCenter: _react.PropTypes.object,
		position: _react.PropTypes.object,
		icon: _react.PropTypes.string,
		thumb: _react.PropTypes.string,
		displayName: _react.PropTypes.string,
		email: _react.PropTypes.string,
		hashtags: _react.PropTypes.array,
		mouseover: _react.PropTypes.func,
		mouseout: _react.PropTypes.func,
		click: _react.PropTypes.func
	};
	exports.default = Marker;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(10);

	var _server2 = _interopRequireDefault(_server);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InfoWindow = function (_Component) {
		_inherits(InfoWindow, _Component);

		function InfoWindow(props) {
			_classCallCheck(this, InfoWindow);

			var _this = _possibleConstructorReturn(this, (InfoWindow.__proto__ || Object.getPrototypeOf(InfoWindow)).call(this, props));

			_this.openWindow = _this.openWindow.bind(_this);
			_this.closeWindow = _this.closeWindow.bind(_this);
			_this.renderInfoWindow = _this.renderInfoWindow.bind(_this);
			return _this;
		}

		_createClass(InfoWindow, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.renderInfoWindow();
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps, prevState) {
				if (this.props.map !== prevProps.map) {
					this.renderInfoWindow();
				}

				if (this.props.visible !== prevProps.visible || this.props.marker !== prevProps.marker) {
					this.props.visible ? this.openWindow() : this.closeWindow();
				}

				if (this.props.children !== prevProps.children) {
					this.updateContent();
				}
			}
		}, {
			key: 'openWindow',
			value: function openWindow() {
				this.infobox.open(this.props.map, this.props.marker);
			}
		}, {
			key: 'closeWindow',
			value: function closeWindow() {
				this.infobox.close();
			}
		}, {
			key: 'renderInfoWindow',
			value: function renderInfoWindow() {
				var _props = this.props;
				var map = _props.map;
				var mapCenter = _props.mapCenter;


				var boxText = document.createElement("div");

				var ibOptions = {
					content: boxText,
					disableAutoPan: false,
					maxWidth: 0,
					alignBottom: true,
					pixelOffset: new google.maps.Size(-158, -67),
					zIndex: null,
					boxClass: 'dawmap-infobox',
					closeBoxMargin: "2px 2px 2px 2px",
					closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
					infoBoxClearance: new google.maps.Size(1, 1),
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: false
				};

				var ib = this.infobox = new InfoBox(ibOptions);
			}
		}, {
			key: 'renderChildren',
			value: function renderChildren() {
				var children = this.props.children;

				return _server2.default.renderToString(children);
			}
		}, {
			key: 'updateContent',
			value: function updateContent() {
				var content = this.renderChildren();
				this.infobox.setContent(content);
			}
		}, {
			key: 'render',
			value: function render() {
				return null;
			}
		}]);

		return InfoWindow;
	}(_react.Component);

	exports.default = InfoWindow;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = ReactDOMServer;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactAvatarCropper = __webpack_require__(12);

	var _reactAvatarCropper2 = _interopRequireDefault(_reactAvatarCropper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FileUpload = function (_Component) {
		_inherits(FileUpload, _Component);

		function FileUpload(props) {
			_classCallCheck(this, FileUpload);

			var _this = _possibleConstructorReturn(this, (FileUpload.__proto__ || Object.getPrototypeOf(FileUpload)).call(this, props));

			_this.onFileChange = _this.onFileChange.bind(_this);
			return _this;
		}

		_createClass(FileUpload, [{
			key: 'onFileChange',
			value: function onFileChange(e) {
				var reader = new FileReader();
				var file = e.target.files[0];

				if (!file) return;

				reader.onload = function (img) {
					_reactDom2.default.findDOMNode(this.refs.avatar).value = '';
					this.props.onFileChange(img.target.result);
				}.bind(this);

				reader.readAsDataURL(file);
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement('input', { ref: 'avatar', type: 'file', accept: 'image/*', onChange: this.onFileChange });
			}
		}]);

		return FileUpload;
	}(_react.Component);

	var AvatarContainer = function (_Component2) {
		_inherits(AvatarContainer, _Component2);

		function AvatarContainer(props) {
			_classCallCheck(this, AvatarContainer);

			var _this2 = _possibleConstructorReturn(this, (AvatarContainer.__proto__ || Object.getPrototypeOf(AvatarContainer)).call(this, props));

			_this2.onFileChange = _this2.onFileChange.bind(_this2);
			_this2.onCrop = _this2.onCrop.bind(_this2);
			_this2.onRequestHide = _this2.onRequestHide(_this2);

			_this2.state = {
				img: null,
				cropperOpen: false,
				croppedImg: ''
			};
			return _this2;
		}

		_createClass(AvatarContainer, [{
			key: 'onFileChange',
			value: function onFileChange(dataURI) {
				this.setState({
					img: dataURI,
					croppedImg: this.state.croppedImg,
					cropperOpen: true
				});
			}
		}, {
			key: 'onCrop',
			value: function onCrop(dataURI) {
				this.setState({
					img: null,
					cropperOpen: false,
					croppedImg: dataURI
				});

				this.props.onChangeAvatar(dataURI);
			}
		}, {
			key: 'onRequestHide',
			value: function onRequestHide() {
				this.setState({
					cropperOpen: false
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var thumbSrc = this.state.croppedImg ? this.state.croppedImg : this.props.initialThumb;

				return _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'div',
						{ className: 'user-thumb' },
						_react2.default.createElement(FileUpload, { onFileChange: this.onFileChange }),
						_react2.default.createElement(
							'div',
							{ className: 'avatar-edit' },
							_react2.default.createElement(
								'span',
								null,
								'Click to Pick Avatar'
							),
							_react2.default.createElement('i', { className: 'fa fa-camera' })
						),
						_react2.default.createElement('img', { src: thumbSrc })
					),
					this.state.cropperOpen && _react2.default.createElement(_reactAvatarCropper2.default, {
						onRequestHide: this.onRequestHide,
						cropperOpen: this.state.cropperOpen,
						onCrop: this.onCrop,
						image: this.state.img,
						width: 200,
						height: 200
					})
				);
			}
		}]);

		return AvatarContainer;
	}(_react.Component);

	var SidebarUser = function (_Component3) {
		_inherits(SidebarUser, _Component3);

		function SidebarUser(props) {
			_classCallCheck(this, SidebarUser);

			var _this3 = _possibleConstructorReturn(this, (SidebarUser.__proto__ || Object.getPrototypeOf(SidebarUser)).call(this, props));

			_this3.handleDescriptionChange = _this3.handleDescriptionChange.bind(_this3);
			_this3.onChangeAvatar = _this3.onChangeAvatar.bind(_this3);
			_this3.onHashtagFormSubmit = _this3.onHashtagFormSubmit.bind(_this3);
			_this3.closeSidebarUser = _this3.closeSidebarUser.bind(_this3);
			_this3.handleHideEmail = _this3.handleHideEmail.bind(_this3);

			_this3.state = {
				description: _this3.props.description,
				hideemail: _this3.props.hideemail
			};
			return _this3;
		}

		_createClass(SidebarUser, [{
			key: 'onChangeAvatar',
			value: function onChangeAvatar(dataURI) {
				this.props.onChangeAvatar(dataURI);
			}
		}, {
			key: 'handleDescriptionChange',
			value: function handleDescriptionChange(e) {
				this.setState({ description: e.target.value });
			}
		},  {
			key: 'handleHideEmail',
			value: function handleHideEmail(e) {
				if ($('input[name="hideemail"]:checked').length > 0) {
					this.setState({ hideemail: true });
				} else {
					this.setState({ hideemail: false });
				}
				console.dir(this.state);
				//update database thing
				/*$.ajax({
					type: "POST",
					url: '/user/update-description',
					data: form.serialize(),
					success: function success(response, status, xhr) {
						form.find('button').attr('disabled', false).toggleClass('green-jungle').text('Saved');

						setTimeout(function () {
							form.find('button').toggleClass('green-jungle').text('Save');
						}, 1000);
					}
				});*/
			}
		},	{
			key: 'onHashtagFormSubmit',
			value: function onHashtagFormSubmit(e) {
				e.preventDefault();

				var $form = $(this.refs.hashtagForm);
				this.props.onHashtagFormSubmit($form);
			}
		}, {
			key: 'closeSidebarUser',
			value: function closeSidebarUser() {
				this.props.onCloseSidebarUser();
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'div',
					{ className: 'page-quick-sidebar-wrapper sidebar-right' },
					_react2.default.createElement(
						'div',
						{ className: 'page-quick-sidebar-header' },
						_react2.default.createElement(
							'h3',
							{ classNam: 'quick-sidebar-heading' },
							'User Setting'
						),
						_react2.default.createElement('a', { onClick: this.closeSidebarUser, href: 'javascript:;', className: 'quick-sidebar-toggler sidebar-right-toggler' })
					),
					_react2.default.createElement(
						'div',
						{ className: 'page-quick-sidebar-body' },
						_react2.default.createElement(
							'div',
							{ className: 'user-info text-center' },
							_react2.default.createElement(AvatarContainer, { initialThumb: this.props.thumb, onChangeAvatar: this.onChangeAvatar }),
							_react2.default.createElement(
								'h3',
								{ className: 'user-heading color-blue' },
								this.props.displayName
							),
							_react2.default.createElement(
								'p',
								null,
								this.props.email
							),
							_react2.default.createElement(
								'a',
								{ href: '/user/logout', className: 'btn btn-circle btn-mw100 grey-cascade' },
								'Sign Out'
							)
						),
						_react2.default.createElement(
							'form',
							{ ref: 'hashtagForm', onSubmit: this.onHashtagFormSubmit, className: 'hashtag-form' },
							_react2.default.createElement(
								'div',
								{ className: 'form-group' },
								_react2.default.createElement('label', {htmlFor : 'hideemail'}, 'Hide my email'),
								_react2.default.createElement('input', { type: 'checkbox', className: 'form-control', name: 'hideemail', defaultChecked: false, value : 0, onChange: this.handleHideEmail }),
								_react2.default.createElement('textarea', { className: 'form-control noresize', rows: '5', placeholder: 'Type your text and #hashtag', required: 'true', name: 'description', value: this.state.description, onChange: this.handleDescriptionChange })
							),
							_react2.default.createElement(
								'div',
								{ className: 'form-actions text-center' },
								_react2.default.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-circle btn-mw100 blue-steel' },
									'Save'
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'text-center' },
							_react2.default.createElement(
								'p',
								{ className: 'mb-15' },
								_react2.default.createElement(
									'a',
									{ href: 'javascript:;', className: 'btn btn-social' },
									_react2.default.createElement('i', { className: 'fa fa-facebook' }),
									' Share to Facebook'
								)
							),
							_react2.default.createElement(
								'p',
								null,
								_react2.default.createElement(
									'a',
									{ href: 'javascript:;', className: 'font-blue-steel' },
									'Change Password'
								)
							)
						)
					)
				);
			}
		}]);

		return SidebarUser;
	}(_react.Component);

	exports.default = SidebarUser;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(1),__webpack_require__(2),__webpack_require__(3)):"function"==typeof define&&define.amd?define(["react","react-dom","react-bootstrap"],t):"object"==typeof exports?exports.ReactAvatarCropper=t(require("react"),require("react-dom"),require("react-bootstrap")):e.ReactAvatarCropper=t(e.react,e["react-dom"],e["react-bootstrap"])}(this,function(e,t,r){return function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={exports:{},id:o,loaded:!1};return e[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),s=function(e,t,r){for(var o=!0;o;){var n=e,i=t,a=r;o=!1,null===n&&(n=Function.prototype);var s=Object.getOwnPropertyDescriptor(n,i);if(void 0!==s){if("value"in s)return s.value;var u=s.get;if(void 0===u)return;return u.call(a)}var p=Object.getPrototypeOf(n);if(null===p)return;e=p,t=i,r=a,o=!0,s=p=void 0}};r(2);var u=r(6),p=o(u),c=r(7),d=o(c),l=r(8),h=r(9),f=r(10),m=o(f),g=function(e,t,r){(0,m["default"])(!isNaN(parseInt(e[t])),"Invalid "+t+" '"+e.size+"' sent to '"+r+"'. Requires an\n    int or string capable of conversion to an int.\n    Check the render method of == '"+r+"'. == ")},v=function(e){function t(){n(this,t),s(Object.getPrototypeOf(t.prototype),"constructor",this).call(this),this.state={dragging:!1,image:{},mouse:{x:null,y:null},preview:null,zoom:1},this.listeners=[]}return i(t,e),a(t,[{key:"fitImageToCanvas",value:function(e,t){var r,o,n=this.props.height/this.props.width,i=t/e;if(n>i){r=this.props.height;var a=r/t;o=e*a}else{o=this.props.width;var a=o/e;r=t*a}return{width:o,height:r}}},{key:"prepareImage",value:function(e){var t=this,r=new Image;(0,h.isDataURL)(e)||(r.crossOrigin="anonymous"),r.onload=function(){var e=t.fitImageToCanvas(r.width,r.height);e.resource=r,e.x=0,e.y=0,t.setState({dragging:!1,image:e,preview:t.toDataURL()})},r.src=e}},{key:"mouseDownListener",value:function(e){this.setState({image:this.state.image,dragging:!0,mouse:{x:null,y:null}})}},{key:"preventSelection",value:function(e){if(this.state.dragging)return e.preventDefault(),!1}},{key:"mouseUpListener",value:function(e){this.setState({dragging:!1,preview:this.toDataURL()})}},{key:"mouseMoveListener",value:function(e){if(this.state.dragging){var t=e.clientX,r=e.clientY,o=this.state.image.x,n=this.state.image.y,i=this.state.image;if(this.state.mouse.x&&this.state.mouse.y){var a=this.state.mouse.x-t,s=this.state.mouse.y-r,u=this.boundedCoords(o,n,a,s);i.x=u.x,i.y=u.y}this.setState({image:this.state.image,mouse:{x:t,y:r}})}}},{key:"boundedCoords",value:function(e,t,r,o){var n=e-r,i=t-o,a=this.state.image.width*this.state.zoom,s=(a-this.state.image.width)/2,u=(this.state.image.x-s,this.props.width);e=n-s>0?s:n<-a+u?u-a:n;var p=this.state.image.height*this.state.zoom,c=(p-this.state.image.height)/2,d=(this.state.image.y-c,this.props.height);return t=i-c>0?c:i<-p+d?d-p:i,{x:e,y:t}}},{key:"componentDidMount",value:function(){var e=this,t=d["default"].findDOMNode(this.refs.canvas);t.getContext("2d");this.prepareImage(this.props.image),this.listeners={mousemove:function(t){return e.mouseMoveListener(t)},mouseup:function(t){return e.mouseUpListener(t)},mousedown:function(t){return e.mouseDownListener(t)}},window.addEventListener("mousemove",this.listeners.mousemove,!1),window.addEventListener("mouseup",this.listeners.mouseup,!1),t.addEventListener("mousedown",this.listeners.mousedown,!1),document.onselectstart=function(t){return e.preventSelection(t)}}},{key:"componentWillUnmount",value:function(){var e=d["default"].findDOMNode(this.refs.canvas);window.removeEventListener("mousemove",this.listeners.mousemove),window.removeEventListener("mouseup",this.listeners.mouseup),e.removeEventListener("mousedown",this.listeners.mousedown)}},{key:"componentDidUpdate",value:function(){var e=d["default"].findDOMNode(this.refs.canvas).getContext("2d");e.clearRect(0,0,this.props.width,this.props.height),this.addImageToCanvas(e,this.state.image)}},{key:"addImageToCanvas",value:function(e,t){if(t.resource){e.save(),e.globalCompositeOperation="destination-over";var r=this.state.image.width*this.state.zoom,o=this.state.image.height*this.state.zoom,n=t.x-(r-this.state.image.width)/2,i=t.y-(o-this.state.image.height)/2;n=Math.min(n,0),i=Math.min(i,0),i=o+i>=this.props.height?i:i+(this.props.height-(o+i)),n=r+n>=this.props.width?n:n+(this.props.width-(r+n)),e.drawImage(t.resource,n,i,t.width*this.state.zoom,t.height*this.state.zoom),e.restore()}}},{key:"toDataURL",value:function(){var e=document.createElement("canvas"),t=e.getContext("2d");return e.width=this.props.width,e.height=this.props.height,this.addImageToCanvas(t,{resource:this.state.image.resource,x:this.state.image.x,y:this.state.image.y,height:this.state.image.height,width:this.state.image.width}),e.toDataURL()}},{key:"handleCrop",value:function(){var e=this.toDataURL();this.props.onCrop(e)}},{key:"handleZoomUpdate",value:function(){var e=this.state;e.zoom=d["default"].findDOMNode(this.refs.zoom).value,this.setState({newstate:e})}},{key:"render",value:function(){return p["default"].createElement("div",{className:"AvatarCropper-canvas"},p["default"].createElement("div",{className:"row"},p["default"].createElement("canvas",{ref:"canvas",width:this.props.width,height:this.props.height})),p["default"].createElement("div",{className:"row"},p["default"].createElement("input",{type:"range",name:"zoom",ref:"zoom",onChange:this.handleZoomUpdate.bind(this),style:{width:this.props.width},min:"1",max:"3",step:"0.01",defaultValue:"1"})),p["default"].createElement("div",{className:"modal-footer"},p["default"].createElement(l.Button,{onClick:this.props.onRequestHide},this.props.closeButtonCopy),p["default"].createElement(l.Button,{bsStyle:"primary",onClick:this.handleCrop.bind(this)},this.props.cropButtonCopy)))}}]),t}(p["default"].Component);v.propTypes={image:p["default"].PropTypes.string.isRequired,width:g,height:g,zoom:g},v.defaultProps={width:400,height:400,zoom:1};var y=function(e){function t(){n(this,t),s(Object.getPrototypeOf(t.prototype),"constructor",this).call(this)}return i(t,e),a(t,[{key:"handleZoomUpdate",value:function(){var e=d["default"].findDOMNode(this.refs.zoom).value;this.setState({zoom:e})}},{key:"render",value:function(){return p["default"].createElement(l.Modal,{title:"Crop It",bsSize:this.props.modalSize,onHide:this.props.onRequestHide,show:this.props.cropperOpen,backdrop:!1},p["default"].createElement("div",{className:"modal-body"},p["default"].createElement("div",{className:"AvatarCropper-base"},p["default"].createElement(v,{image:this.props.image,width:this.props.width,height:this.props.height,onCrop:this.props.onCrop,onRequestHide:this.props.onRequestHide,closeButtonCopy:this.props.closeButtonCopy,cropButtonCopy:this.props.cropButtonCopy}))))}}]),t}(p["default"].Component);y.propTypes={image:p["default"].PropTypes.string.isRequired,onCrop:p["default"].PropTypes.func.isRequired,closeButtonCopy:p["default"].PropTypes.string,cropButtonCopy:p["default"].PropTypes.string,width:g,height:g,modalSize:p["default"].PropTypes.oneOf(["lg","large","sm","small"]),onRequestHide:p["default"].PropTypes.func.isRequired},y.defaultProps={width:400,height:400,modalSize:"large",closeButtonCopy:"Close",cropButtonCopy:"Crop and Save"},t["default"]=y,e.exports=t["default"]},function(e,t,r){var o=r(3);"string"==typeof o&&(o=[[e.id,o,""]]);r(5)(o,{});o.locals&&(e.exports=o.locals)},function(e,t,r){t=e.exports=r(4)(),t.push([e.id,".AvatarCropper-base{text-align:center}.AvatarCropper-base input[type=range]{display:inline-block;-webkit-appearance:none;padding:20px 0;border:1px solid #fff;width:400px}.AvatarCropper-base input[type=range]::-webkit-slider-runnable-track{width:400px;height:5px;background:#ddd;border:none;border-radius:3px}.AvatarCropper-base input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;border:none;height:16px;width:16px;border-radius:50%;background:#454545;margin-top:-4px}.AvatarCropper-base input[type=range]:focus{outline:0}.AvatarCropper-base input[type=range]:focus::-webkit-slider-runnable-track{background:#ccc}.AvatarCropper-base input[type=range]::-moz-range-track{width:400px;height:5px;background:#ddd;border:none;border-radius:3px}.AvatarCropper-base input[type=range]::-moz-range-thumb{border:none;height:16px;width:16px;border-radius:50%;background:#454545}.AvatarCropper-base input[type=range]:-moz-focusring{outline:#fff solid 1px;outline-offset:-1px}.AvatarCropper-base input[type=range]::-ms-track{width:400px;height:5px;background:0 0;border-color:transparent;border-width:6px 0;color:transparent}.AvatarCropper-base input[type=range]::-ms-fill-lower{background:#777;border-radius:10px}.AvatarCropper-base input[type=range]::-ms-fill-upper{background:#ddd;border-radius:10px}.AvatarCropper-base input[type=range]::-ms-thumb{border:none;height:16px;width:16px;border-radius:50%;background:#454545}.AvatarCropper-base input[type=range]:focus::-ms-fill-lower{background:#888}.AvatarCropper-base input[type=range]:focus::-ms-fill-upper{background:#ccc}.AvatarCropper-base canvas{cursor:move}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var r=this[t];r[2]?e.push("@media "+r[2]+"{"+r[1]+"}"):e.push(r[1])}return e.join("")},e.i=function(t,r){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},n=0;n<this.length;n++){var i=this[n][0];"number"==typeof i&&(o[i]=!0)}for(n=0;n<t.length;n++){var a=t[n];"number"==typeof a[0]&&o[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),e.push(a))}},e}},function(e,t,r){function o(e,t){for(var r=0;r<e.length;r++){var o=e[r],n=d[o.id];if(n){n.refs++;for(var i=0;i<n.parts.length;i++)n.parts[i](o.parts[i]);for(;i<o.parts.length;i++)n.parts.push(s(o.parts[i],t))}else{for(var a=[],i=0;i<o.parts.length;i++)a.push(s(o.parts[i],t));d[o.id]={id:o.id,refs:1,parts:a}}}}function n(e){for(var t=[],r={},o=0;o<e.length;o++){var n=e[o],i=n[0],a=n[1],s=n[2],u=n[3],p={css:a,media:s,sourceMap:u};r[i]?r[i].parts.push(p):t.push(r[i]={id:i,parts:[p]})}return t}function i(){var e=document.createElement("style"),t=f();return e.type="text/css",t.appendChild(e),e}function a(){var e=document.createElement("link"),t=f();return e.rel="stylesheet",t.appendChild(e),e}function s(e,t){var r,o,n;if(t.singleton){var s=g++;r=m||(m=i()),o=u.bind(null,r,s,!1),n=u.bind(null,r,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=a(),o=c.bind(null,r),n=function(){r.parentNode.removeChild(r),r.href&&URL.revokeObjectURL(r.href)}):(r=i(),o=p.bind(null,r),n=function(){r.parentNode.removeChild(r)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else n()}}function u(e,t,r,o){var n=r?"":o.css;if(e.styleSheet)e.styleSheet.cssText=v(t,n);else{var i=document.createTextNode(n),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function p(e,t){var r=t.css,o=t.media;t.sourceMap;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}function c(e,t){var r=t.css,o=(t.media,t.sourceMap);o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var n=new Blob([r],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(n),i&&URL.revokeObjectURL(i)}var d={},l=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},h=l(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),f=l(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,g=0;e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=h());var r=n(e);return o(r,t),function(e){for(var i=[],a=0;a<r.length;a++){var s=r[a],u=d[s.id];u.refs--,i.push(u)}if(e){var p=n(e);o(p,t)}for(var a=0;a<i.length;a++){var u=i[a];if(0===u.refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete d[u.id]}}}};var v=function(){var e=[];return function(t,r){return e[t]=r,e.filter(Boolean).join("\n")}}()},function(t,r){t.exports=e},function(e,r){e.exports=t},function(e,t){e.exports=r},function(e,t){"use strict";function r(e){return!!e.match(r.regex)}Object.defineProperty(t,"__esModule",{value:!0}),t.isDataURL=r,r.regex=/^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i},function(e,t,r){(function(t){"use strict";var r=function(){};"production"!==t.env.NODE_ENV&&(r=function(e,t,r){var o=arguments.length;r=new Array(o>2?o-2:0);for(var n=2;n<o;n++)r[n-2]=arguments[n];if(void 0===t)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(t.length<10||/^[s\W]*$/.test(t))throw new Error("The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: "+t);if(!e){var i=0,a="Warning: "+t.replace(/%s/g,function(){return r[i++]});"undefined"!=typeof console&&console.error(a);try{throw new Error(a)}catch(s){}}}),e.exports=r}).call(t,r(11))},function(e,t){function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function n(e){if(c===setTimeout)return setTimeout(e,0);if((c===r||!c)&&setTimeout)return c=setTimeout,setTimeout(e,0);try{return c(e,0)}catch(t){try{return c.call(null,e,0)}catch(t){return c.call(this,e,0)}}}function i(e){if(d===clearTimeout)return clearTimeout(e);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(e);try{return d(e)}catch(t){try{return d.call(null,e)}catch(t){return d.call(this,e)}}}function a(){m&&h&&(m=!1,h.length?f=h.concat(f):g=-1,f.length&&s())}function s(){if(!m){var e=n(a);m=!0;for(var t=f.length;t;){for(h=f,f=[];++g<t;)h&&h[g].run();g=-1,t=f.length}h=null,m=!1,i(e)}}function u(e,t){this.fun=e,this.array=t}function p(){}var c,d,l=e.exports={};!function(){try{c="function"==typeof setTimeout?setTimeout:r}catch(e){c=r}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(e){d=o}}();var h,f=[],m=!1,g=-1;l.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];f.push(new u(e,t)),1!==f.length||m||n(s)},u.prototype.run=function(){this.fun.apply(null,this.array)},l.title="browser",l.browser=!0,l.env={},l.argv=[],l.version="",l.versions={},l.on=p,l.addListener=p,l.once=p,l.off=p,l.removeListener=p,l.removeAllListeners=p,l.emit=p,l.binding=function(e){throw new Error("process.binding is not supported")},l.cwd=function(){return"/"},l.chdir=function(e){throw new Error("process.chdir is not supported")},l.umask=function(){return 0}}])});

/***/ }
/******/ ]);