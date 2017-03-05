var Tutor = React.createClass({
	render: function() { return (
		<li className="inner">
			<div className="row row-m-10">
    			<div className="col-sm-2 col-p-10">
    				<div className="tutor-photo">
        				<a href={this.props.href} target="_blank">
        					<img className="img-circle" src={this.props.thumb} alt={this.props.name} />
        				</a>
        			</div>
        			<div className="tutor-meta">
        				<ul className="meta">
    						<li><i className="icon-symbol-female"></i> {this.props.gender}</li>
    						<li><i className="fa fa-birthday-cake"></i> {this.props.age} tuổi</li>
    					</ul>
        			</div>
    			</div>
        		<div className="col-sm-7 col-p-10">
        			<div className="tutor-info">
        				<div className="main-info">
    						<h3 className="tutor-name ellipsis"><a href={this.props.href} target="_blank">{this.props.name}</a></h3>
    						<div className="tutor-focus margin-bottom-5 hint-text sbold fs-15">{this.props.teaching_status}, {this.props.occupation}</div>
    						<span className="guaranted tooltips" data-toggle="tooltip" data-placement="left" title="Đã xác thực"><span className="icon-guaranted"></span></span>
    					</div>
    					<div className="tutor-description">{this.props.description}</div>
        			</div>
    			</div>
    			<div className="col-sm-3 col-p-10">
    				<div className="hourly-rate"><span className="price color-orange">{this.props.price}</span> VNĐ/h</div>
    				<div className="tutor-stats">
    					<div className="stat"><span aria-hidden="true" className="icon icon-star"></span> <span className="color-orange sbold">5.0</span> (27 đánh giá)</div>
    					<div className="stat"><span aria-hidden="true" className="icon icon-hourglass"></span> <span className="color-orange sbold">1-2</span> năm kinh nghiệm</div>
    					<div className="stat"><span aria-hidden="true" className="icon icon-graduation"></span> <span className="color-orange sbold">4</span> bằng cấp/chứng chỉ</div>
    				</div>
    				<a href={this.props.href} target="_blank" className="btn btn-block btn-hero green-dark uppercase sbold margin-top-10">Xem chi tiết</a>
    			</div>
    		</div>
    	</li>
	); }
});

var ListPagination = React.createClass({
	dispatchPage: function(page) {
		this.props.onDispatchPage(page);
	},
	render: function() {
		var self = this;
		
		return (
			<div className="pagination-wrap">
				<div className="row">
			    	<div className="col-md-5 col-sm-12">
			    		<div className="pagination_info">
			    			Đang hiển thị từ {this.props.firstItemNumber} đến {this.props.lastItemNumber} của {this.props.totalItemCount} kết quả
			    		</div>
			    	</div>
			    	<div className="col-md-7 col-sm-12">
			         	<div className="pagination_numbers paging_simple_numbers">
			          		<ul className="pagination pull-right">
			                     <li className={'paginate_button previous' + (!this.props.previous ? ' disabled' : '')}>
			                         <a href="javascript:;" onClick={this.dispatchPage.bind(this, this.props.previous)}>
			                             <span aria-hidden="true">&larr;</span>
			                         </a>
			                     </li>
			                     {this.props.pagesInRange.map(function(page, i) { console.log(page);
			                    	 return (
				                    	<li className={'paginate_button' + (page==self.props.current ? " active" : '')}>
				                    		<a href="javascript:;" onClick={self.dispatchPage.bind(this, page)}>
					                             {page}
					                        </a>
						              	</li>
			                    	 );
			                     })}
			                     <li className={'paginate_button next' + (!this.props.next ? ' disabled' : '')}>
			                         <a href="javascript:;" onClick={this.dispatchPage.bind(this, this.props.next)}>
			                             <span aria-hidden="true">&rarr;</span>
			                         </a>
			                     </li>
			         		</ul>
			         	</div>
			    	</div>
		    	</div>
		    </div>
		);
	}
});

var ListTutors = React.createClass({
	render: function() {
		var TutorNodes = this.props.tutors.map(function(tutor) {
			return (
				<Tutor href={tutor.href} name={tutor.name} thumb={tutor.thumb} gender={tutor.gender} age={tutor.age} teaching_status={tutor.teaching_status} occupation={tutor.occupation} description={tutor.description} price={tutor.price}></Tutor>
			);
	    });
		
		return (
			<ul className="tutors">{TutorNodes}</ul>
		);
	}
});

var Signup = React.createClass({
	setGender: function(e) {
		this.setState({
			gender: e.target.value
		});
	},
	getInitialState: function () {
		return {
	    	gender: '',
		};
	},
	render: function() {
		return (
		<div className="modal fade" id="signup" tabindex="-1" role="basic" aria-hidden="true">
		    <div className="modal-dialog modal-sm">
		        <div className="modal-content">
		            <div className="modal-header">
		                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
		            </div>
		            <div className="modal-body">
		            	<form className="register-form" autocomplete="off">
		            		<h4 className="text-center sbold mb-20">Sign Up</h4>
		            		<div className="form-group">
		            			<div className="input-icon">
		                        	<i className="icon-envelope"></i>
		                        	<input className="form-control" type="text" placeholder="Email Address" name="email" />
		                        </div>
		            		</div>
		            		<div className="form-group">
		            			<div className="input-icon">
		                        	<i className="icon-user"></i>
		                        	<input className="form-control" type="text" placeholder="Name" name="email" />
		                        </div>
		            		</div>
		            		<div className="form-group">
		                        <div className="input-icon">
		                            <i className="icon-lock"></i>
		                            <input className="form-control" type="password" placeholder="Password" name="password" />
		                    	</div>
		                    </div>
		                    <div className="form-group">
		                        <div className="input-icon">
		                            <i className="icon-check"></i>
		                            <input className="form-control" type="password" placeholder="Confirm Password" name="password" />
		                    	</div>
		                    </div>
		                    <div className="form-actions mb-15">
		                        <button type="button" className="btn btn-block btn-md blue-steel sbold">Submit</button>
		                    </div>
		            	</form>
		            </div>
		        </div>
		    </div>
		</div>
		)
	}
});

var Search = React.createClass({
	fetchTutors: function() {
		$.ajax({
			url: '/search/tutors',
			dataType: 'json',
			cache: false,
			success: function(data) { console.log('fetched data');
				this.setState({tutors: data.items, total: data.total, paginator: data.paginator});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleDispatchPage: function(page) {
		var url = '/search/tutors?page=' + page;
		$.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			success: function(data) { console.log('fetched data');
				this.setState({tutors: data.items, total: data.total, paginator: data.paginator});
				browserHistory.push('?page='+ page);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {
			tutors: [],
			total: 0,
			paginator: {
				firstItemNumber: 0,
				lastItemNumber: 0,
				totalItemCount: 0,
				current: '',
				previous: '',
				next: '',
				pagesInRange: []
			},
		};
	},
	componentDidMount: function() {
		
	},
	render() { return (
		<div> Hello moi nguoi
			<Signup />
		</div>
	);}
});

ReactDOM.render(
	<Search />,
	document.getElementById('app')
);