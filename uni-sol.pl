# This file defines routes for uni-sol (https://github.com/uni-sol/uni-sol)

sub getIndex {
	my $self = shift;
	my $URL = $self->req->url->base;
	$self->stash( url => $URL, version => $version ); # stash the url and display in template
	$self->stash( canvasApp => '/js-demos/scripts/koch.js' );
	$self->render('index');
};

sub getReadme {
	my( $self, $readme ) = @_;
	my $URL = $self->req->url->base;
	my( $fh, $mh, $save_line_sep );
	my $mark2html = '';
	open $mh, '>', \$mark2html;
	my $mark = Markdent::Parser->new(
		dialect => 'GitHub',
		handler => Markdent::Handler::HTMLStream::Fragment->new(
			output => $mh
		)
	);
	
	open $fh, '<'.$readme;
	$save_line_sep = $/; # Save line seperator vaule
    undef $/; # Allows one pass input of entire file
	$mark->parse( markdown => <$fh> );
    $/ = $save_line_sep; # Restore line seprator
	close $fh;
	close $mh;
	
	my( $apppath ) = $readme =~ /([\w\-]+\/)\w+\.md/;
	$apppath = $URL.'/'.$apppath if( $apppath );
	$apppath = $URL unless( defined $apppath );
	$mark2html = rel2AbsURI( 
		$mark2html, 
		$URL.'/',
		$apppath
	);
	
	($readme) = $readme =~ /(\w+)\//;
	#$log->debug( $readme ."\n" );
	$mark2html = "\n<div class=\"$readme\">\n". $mark2html ."\n</div>\n";
	#$log->debug( $mark2html ."\n" );
	
	$self->stash( 
		url => $URL,
		version => $version,
		mark2html => $mark2html,
		canvasApp => '/js-demos/scripts/koch.js' 
	);
	$self->render('readme');
};

get '/js-demos' => sub {
	my $self = shift;
	getReadme($self, 'js-demos/README.md');
};

get '/vision' => sub {
	my $self = shift;
	$self->stash( 
		version => $version, # stash the url and display in template
		header => "Share The Dream",
		canvasApp => '/js-demos/scripts/interact-visualizer.js'
	);
	$self->stash( mediaDIV => '<div id="stream" style="text-align: center"><br /><audio id="aud1" preload="auto" controls="true"><source src="/js-demos/audio/stymaps.mp3" /><source src="/js-demos/audio/stymaps.ogg" /></audio></div>' );
	$self->render('vision');
};

get '/fathers' => sub {
	my $self = shift;
	$self->stash( 
		version => $version, # stash the url and display in template
		canvasApp => '/js-demos/scripts/interact-visualizer.js'
	);
	$self->stash( 
		mediaDIV => q[<div id="stream" style="display:none; text-align:center"><video id="aud1" preload="auto"  controls="true"> <source src="/js-demos/video/fathers.mp4" /> <source src="/js-demos/video/fathers.ogv" /> </video></div> <a id="aud1_play" href="" onclick="(function() { audio.play(); jQuery('#home_screen').fadeOut(5333); jQuery('#transparent_background').fadeOut(5333); jQuery('#aud1_play').html('Now Playing'); } ());">Play</a> <script type="text/javascript">(function() { window.aud1_play.style.display = "none"; window.aud1.addEventListener( "loadstart", function(evt){ setTimeout( function() { window.aud1_play.style.display = "inline"; }, 15333 ); } );} ());</script>].
					q[<h1 id="text_title">Fathers</h1><p id="text_copy" style="display:none;">].
					qq[\nDon't Give Up\n\nOn Yourself\n\nOn Your Dreams\n\nThis is the moment\n\nYour power has never been greater\n\nYour priviledge has never stood higher\n\nYour influence is without measure\n\nOnly your fear\n\nOnly your lost spirit\n\nCan keep you from the promised land\n\nThe land of your ancestors\n\nThe land of your children\n\nWhere you would join them\n\nIf you would lead and follow\n\nAs your heart demands\n].
					q[</p>]
	);
	$self->render('visualizer');
};

get '/visualizer' => sub {
	my $self = shift;
	$self->stash( 
		version => $version, # stash the url and display in template
		canvasApp => '/js-demos/scripts/interact-visualizer.js'
	);
	$self->stash( mediaDIV => '<div id="stream" style="text-align: center"><br /><audio id="aud1" preload="auto" controls="true"><source src="/js-demos/audio/The_Map.mp3" /><source src="/js-demos/audio/The_Map.ogg" /></audio></div>' );
	$self->render('visualizer');
};

get '/js-demos/visualizer' => sub {
	my $self = shift;
	$self->stash( 
		version => $version, # stash the url and display in template
		canvasApp => '/js-demos/scripts/interact-visualizer.js'
	);
	$self->stash( mediaDIV => '<div id="stream" style="text-align: center"><br /><audio id="aud1" preload="auto" controls="true"><source src="/js-demos/audio/The_Map.mp3" /><source src="/js-demos/audio/The_Map.ogg" /></audio></div>' );
	$self->render('visualizer');
};

1;
