$(document).ready( function() {
  var selectcity = $('#field-4');
  var selectcamp = $('#field-camp');
  var selectlocationA = $('#austin-texas');
  var selectlocationD = $('#dallas');
  var listType = $('#list-type .type-image-url');
  var courses = $('#courses-list .card');
  var listcity = $('#city-list span');
  var listcamp = $('#season-list span');
  var listloc = $('#location-list span');
  var allType = jQuery.parseJSON('[]');
  var count = courses.length;
  var textCount = document.createElement('span');
  textCount.textContent = count + ' Courses found';
  $('.filter-subtitle.count').append(textCount);
  listType.each(function(idx, element){
   var st = jQuery.parseJSON($(element).text())
   allType.push(st)
  })

  listcity.each(function(idx, element){
   var sc = jQuery.parseJSON($(element).text())
   selectcity.append('<option value="' + sc.value +'" >'+ sc.name +'</option>')
  })
  listcamp.each(function(idx, element){
   var scamp = jQuery.parseJSON($(element).text())
   selectcamp.append('<option value="' + scamp.value +'" >'+ scamp.name +'</option>')
  })
  listloc.each(function(idx, element){
   var sl = jQuery.parseJSON($(element).text())
   if(sl.city == 'dallas' && sl.hidden == 'false'){
    selectlocationD.append('<option value="' + sl.value +'" >'+ sl.name +'</option>')
   }else if(sl.city == 'austin-texas' && sl.hidden == 'false'){
    selectlocationA.append('<option value="' + sl.value +'" >'+ sl.name +'</option>')
   } 	
  })
  $('.w-dyn-item .filters-type').each(function(index, element) {
   var _this = $( element );
   _this.parent().parent().addClass( _this.text().toLowerCase().replace(',','').replace(' /','').replace(/\//g,'-').replace(' &','').replace(/ /g, '-'));
  });
  $('.w-dyn-item .tabs-camps.level:not(.w-condition-invisible)').each(function(index, element) {
  		var _this = $( element );
      // lowercase, hyphenate and add as a class to dyn-item for isotope filtering
  		_this.parent().parent().parent().parent().parent().addClass( _this.text().toLowerCase().replace(/\//g,'-').replace(/ /g, '-'));
  });
  $('.w-dyn-item .tabs-camps .level:not(.w-condition-invisible)').each(function(index, element) {
  		var _this = $( element );
      // lowercase, hyphenate and add as a class to dyn-item for isotope filtering
  		_this.parent().parent().parent().parent().parent().parent().parent().addClass( _this.text().toLowerCase().replace(/\//g,'-').replace(/ /g, '-'));
  });
 var listFilters = $('.filters-card-elements span');
  listFilters.each(function(idx, element){
      var all = jQuery.parseJSON($(element).text());
      $(element).parent().parent().parent().addClass(all.city);
      $(element).parent().parent().parent().addClass(all.location);
      $(element).parent().parent().parent().addClass(all.camp);
     })
  
  $('.location-select.austin-texas').prop('disabled', 'disabled');
  var urlParams = new URLSearchParams(window.location.search);
  var filterCourse = urlParams.get('course');
  var filterLocation = urlParams.get('location');
  var filterCity = urlParams.get('city');
  // init Isotope
  let qsRegex;
  let buttonFilter;
  var filters = {};
  var comboFilter;
  var cityValue;
  var campValue;
  var locationValue;
  var minR = 5;
  var maxR = 15;
  var dateMin;
  var dateMax;
 
	
  const $grid = $('.grid').isotope({
      itemSelector: '.w-dyn-item',
      filter: function() {
        var $this = $(this);
        var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
        var buttonResult = comboFilter ? $this.is( comboFilter ) : true;
        return searchResult && buttonResult;
      }
  });

  const $items = $grid.find('.w-dyn-item');
  $grid.addClass('is-showing-items').isotope( 'revealItemElements', $items );
  
	
  $(function() {
      var options = {
          range: true,
          min: 5,
          max: 15,
          values: [5, 15],
          slide: function(event, ui) {
              minR = ui.values[0],
              maxR = ui.values[1];
              $(".age-range").text( "From " + minR + " to " + maxR);
              $checkbox = $("#slider-range");
    	      manageCheckbox( $checkbox );
              comboFilter = getComboFilter( filters );
              $grid.isotope();
              counterFindCourses();
          }
      }, min, max;
      $("#slider-range").slider(options);
      min = $("#slider-range").slider("values", 0);
      max = $("#slider-range").slider("values", 1);
      $(".range-info--text.age-range").text("From " + min + " to " + max);
  });
 	
	
$(function() {

  $('input[name="daterange"]').daterangepicker({
      autoUpdateInput: false,
      locale: {
          cancelLabel: 'Clear'
      },
      opens: 'right',
  });

  $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('M-D-YYYY') + ' - ' + picker.endDate.format('M-D-YYYY'));
 			dateMin = picker.startDate.format('M-D-YYYY');
      dateMax = picker.endDate.format('M-D-YYYY');
      $checkbox = $("#daterange");
    manageCheckbox( $checkbox );
    comboFilter = getComboFilter( filters );
    $grid.isotope();
    counterFindCourses();
 });

  $('input[name="daterange"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      dateMin = undefined;
      dateMax = undefined;
      $checkbox = $("#daterange");
    manageCheckbox( $checkbox );
    comboFilter = getComboFilter( filters );
    $grid.isotope();
    counterFindCourses();
  });

});

  if(filterCourse != null){
    $('#' + filterCourse)[0].checked = true;
    filters['type'] = ['.'+filterCourse];
    comboFilter = getComboFilter( filters );
    $grid.isotope();
    counterFindCourses();
  }else if(filterLocation != null){
  	if(filterCity == 'dallas'){
    	cityValue = '.dallas';
      $('.location-select.dallas').css('display','block');
      $('.location-select' + cityValue).val('.'+filterLocation);
      $('.city-select').val('.dallas');
    }else if(filterCity == 'austin-texas'){
   		cityValue = '.austin-texas';
      $('.location-select.austin-texas').css('display','block');
      $('.location-select' + cityValue).val('.'+filterLocation);
      $('.city-select').val('.austin-texas');
    }
    $('.location-select' + cityValue).prop('disabled', false);
    locationValue = '.'+filterLocation;
    filters['city'] = [cityValue];
    filters['location'] = [locationValue];
    comboFilter = getComboFilter( filters );
    $grid.isotope();
    counterFindCourses();
  }
  $('#filters-courses').on( 'change', function( event ) {
    var $checkbox = $( event.target );
    manageCheckbox( $checkbox );
    if($('.city-select')[0] != undefined ){
    	cityValue = $('.city-select')[0].value;
	    if( cityValue != '*'){
	      $('.location-select' + cityValue).css('display','block');
	      $('.location-select:not(' + cityValue + ')').val('*');
	      $('.location-select:not(' + cityValue + ')').css('display','none');
	      $('.location-select' + cityValue).prop('disabled', false);
	    }else{
		$('.location-select.dallas').css('display','none');
	      $('.location-select.austin-texas').css('display','block');
	      $('.location-select.austin-texas').prop('disabled', 'disabled');
	      $('.location-select').val('*')
	    }
    }
    
    campValue = $('.camp-select')[0].value;  
    if($('.location-select')[0] != undefined ){
      locationValue = $('.location-select'+cityValue)[0].value;
    }
    
    comboFilter = getComboFilter( filters );
    $grid.isotope();
    counterFindCourses();
    if(comboFilter != null || comboFilter != undefined){
    	$('.button.clear').css('display','block');
    }
  });
  $('.button.clear').on('click', function() {
      filters = {};
      $('.button.clear').css('display','none');
      qsRegex = undefined;
      $('.quicksearch')[0].value = "";
      var checkboxs = $('.button.checkbox');
      $('.input-select select').val('*');
      for ( var i=0; i <  checkboxs.length; i++ ){
      	checkboxs[i].checked = false;
      }
      $('#graphic-web-design')[0].checked = false
      comboFilter = getComboFilter( filters );
    	$grid.isotope();
      counterFindCourses();
  });
  // use value of search field to filter
  const $quicksearch = $('#quicksearch').keyup(debounce(function() {
    qsRegex = new RegExp($quicksearch.val(),'gi');
    $grid.isotope();
    counterFindCourses();
  }));


  // debounce so filtering doesn't happen every millisecond
  function debounce(fn, threshold) {
      let timeout;
      return function debounced() {
        if ( timeout ) {
          clearTimeout( timeout );
        }
        function delayed() {
          fn();
          timeout = null;
        }
        setTimeout( delayed, threshold || 100 );
      };
  };


  // disable search from submitting
  $('#quicksearch').on('keyup keypress', function(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    }
  });

  function getComboFilter( filters ) {
    var i = 0;
    var comboFilters = [];
    var message = [];
    var allage = [];
    for ( var prop in filters ) {
     if( prop == 'city' ){
      	filters[prop] = [cityValue];
      }else if(prop == 'location'){
      	filters[prop] = [locationValue];
      }else if(prop == 'camp'){
      	filters[prop] = [campValue];
      }else if (prop == 'range'){
      	allage = [];
        for(var m=minR; m <= maxR; m++){
        	allage.push('.'+m);
        }
	if(allage.length == 19){
		allage = [];
	}
      	filters[prop] = allage;
      }else if(prop == 'date'){
        if(dateMax == undefined && dateMin == undefined){
        	filters[prop] = [];
        }else{
        filters[prop] = getDates(dateMin,dateMax);
        }
      
      }
      message.push( filters[ prop ].join(' ') );
      var filterGroup = filters[ prop ];
      // skip to next filter group if it doesn't have any value
      if ( !filterGroup.length ) {
        continue;
      }
      if ( i === 0 ) {
        // copy to new array
        comboFilters = filterGroup.slice(0);
      } else {
        var filterSelectors = [];
        // copy to fresh array
        var groupCombo = comboFilters.slice(0); // [ A, B ]
        // merge filter Groups
        for (var k=0, len3 = filterGroup.length; k < len3; k++) {
          for (var j=0, len2 = groupCombo.length; j < len2; j++) {
            filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
          }
        }
        // apply filter selectors to combo filters for next group
        comboFilters = filterSelectors;
      }
      i++;
    }

    var comboFilter = comboFilters.join(', ');
    return comboFilter;
  }

  function manageCheckbox( $checkbox ) {
    var checkbox = $checkbox[0];

    var group = $checkbox.parents('.option-set').attr('data-group');
    // create array for filter group, if not there yet
    var filterGroup = filters[ group ];
    if ( !filterGroup ) {
      filterGroup = filters[ group ] = [];
    }
    var isAll = $checkbox.hasClass('all');
    // reset filter group if the all box was checked
    if ( isAll ) {
      delete filters[ group ];
      if ( !checkbox.checked ) {
        checkbox.checked = 'checked';
      }
    }
    // index of
    var index = $.inArray( checkbox.value, filterGroup );

    if ( checkbox.checked ) {
      var selector = isAll ? 'input' : 'input.all';
      $checkbox.siblings( selector ).removeAttr('checked');


      if ( !isAll && index === -1 ) {
        // add filter to group
        filters[ group ].push( checkbox.value );
      }

    } else if ( !isAll ) {
      // remove filter from group
      filters[ group ].splice( index, 1 );
      // if unchecked the last box, check the all
      if ( !$checkbox.siblings('[checked]').length ) {
        $checkbox.siblings('input.all').attr('checked', 'checked');
      }
    }

  }
	function counterFindCourses() {
  	var countCourse = 0;
   	 var styles;
  	$('#courses-list .card-item').each(function(idx,element){
      styles = $(element)[0].attributes[1].nodeValue;
      if(styles.indexOf("opacity: 0") > -1 || styles.indexOf("display: none") > -1){
      	countCourse = countCourse + 1;
      }
    })
    count = courses.length - countCourse;
    let fullDay = $($('input[name="full-day"]:checked'))
    if(count == 0 && fullDay.length > 0){
    	$('.camps_info--block').removeClass('hide')
    }else{
    	$('.camps_info--block').addClass('hide')
    }
    textCount.textContent = count + ' Courses found';
  }

  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push('.'+ moment(currentDate).format('M-D-YYYY') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}
});
