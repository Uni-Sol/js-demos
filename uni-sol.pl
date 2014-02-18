# This file defines routes for uni-sol (https://github.com/uni-sol/uni-sol)

sub getIndex {
	my $self = shift;
	my $URL = $self->req->url->base;
	$self->stash( url => $URL, version => $version ); # stash the url and display in template
	$self->stash( canvasApp => 'js-demos/scripts/koch.js' );
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
	
	$self->stash( 
		url => $URL,
		version => $version,
		mark2html => $mark2html,
		canvasApp => 'js-demos/scripts/koch.js' 
	);
	$self->render('readme');
};

get '/js-demos' => sub {
	my $self = shift;
	getReadme($self, 'js-demos/README.md');
};

get '/vision' => sub {
	my $self = shift;
	$self->stash( version => $version ); # stash the url and display in template
	$self->stash( canvasApp => 'js-demos/scripts/interact-visualizer.js' );
	$self->render('vision');
};

get '/visualizer' => sub {
	my $self = shift;
	$self->stash( version => $version ); # stash the url and display in template
	$self->stash( canvasApp => 'js-demos/scripts/interact-visualizer.js' );
	$self->render('visualizer');
};

1;
