#!/usr/bin/perl
use warnings;
use strict;
use feature ':5.14';
#use Math::BigFloat;

use Audio::Analyzer;

my ( $source, $output, $analyzer, $log, $complete, @pcm, @freqs, @fft, $frameNum, $sampleNum, $frameSampleNum );
$source = $ARGV[0] || 'audio/TONES001.wav';
die "Please use WAV files\n" if( $source !~ /\.wav/ );
($output) = ( $source =~ /[\/|\\]*([\w|\-|]+)\.wav$/ );
$analyzer = Audio::Analyzer->new(
	  file => $source,
	  channels => 1,
	  bits_per_sample => 16,
	  sample_rate => 44100,
	  fps => 15,
	  scaler => 'Audio::Analyzer::AutoScaler'
	);

open $log, '>data/'.$output.'-00.js';
print $log <<TXT; 	
var sBuffer = ['pcm,frequency,magnitude'];
TXT
$complete = 0;
$frameNum = 0;
$sampleNum = 0;
$frameSampleNum = 0;
my $sofar;

while( defined(my $chunk = $analyzer->next) ) {
	print $log <<TXT;

sBuffer.push([
TXT
	#useful information
	@pcm = @{$chunk->pcm->[0]};
	@freqs = @{$analyzer->freqs};
	@fft = @{$chunk->fft->[0]};
	
	for( my $i=0; $i<@freqs; $i++ ) {
		$sampleNum++;
		$frameSampleNum++;
		next if( ($frameSampleNum % 10) > 0 );
		
		#print $source.', s:'.$sampleNum.', f:'.$frameSampleNum.', frame'.$frameNum." \n";
		my $v = ( $pcm[$i] / 65536);
		#$v = Math::BigFloat->new($v);
		#$v->ffround(-3);
		my $f = $freqs[$i];
		#$f = Math::BigFloat->new($f);
		#$f->ffround(0);
		my $m = $fft[$i];
		#$m = Math::BigFloat->new($m);
		#$m->ffround(-3);
		print $log "\'". join( ",", ($v, $f, $m) ) ."\',\n"; # Temp using zero freq values
	}
	print $log <<TXT;
]);

TXT

	$frameNum++;
	$frameSampleNum = 0;
	if( $sofar > 99 ){
		print $log <<TXT;

(function() {
  window.fftProgress++;
  var aBuffer = canvasApp.aBuffer;
  var fBuffer = canvasApp.fBuffer;
  var vBuffer = canvasApp.vBuffer;
  Debugger.log( "Progress "+ fftProgress +"%" );
  if( fftProgress < 10 ) {
	return;
  }
  
  if( sBuffer.length > 0 ) {
	for( var i=(aBuffer.length-1), z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			a.push( afv[0] );
			f.push( afv[1] );
			v.push( afv[2] );
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
	}
	Debugger.log( "Total frames: "+ (aBuffer.length) );
  }
})();
TXT
		close $log;
		print $sofar ."%\n" ;
		last;
	} elsif( $sofar > $complete ) {
		print $log <<TXT;

(function() {
  window.fftProgress++;
  var aBuffer = canvasApp.aBuffer;
  var fBuffer = canvasApp.fBuffer;
  var vBuffer = canvasApp.vBuffer;
  Debugger.log( "Progress "+ fftProgress +"%" );
  if( fftProgress < 10 ) {
	return;
  }
  
  if( sBuffer.length > 0 ) {
	for( var i=(aBuffer.length-1), z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			a.push( afv[0] );
			f.push( afv[1] );
			v.push( afv[2] );
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
	}
	Debugger.log( "Total frames: "+ (aBuffer.length) );
  }
})();
TXT
		close $log;
		print $sofar ."%\n" ;
		open $log, '>data/'.$output.'-0'.$sofar.'.js' if( $sofar < 10 );
		open $log, '>data/'.$output.'-'.$sofar.'.js' if( $sofar >=10 );
	}
	print $sofar ."%\n" ;
	$complete = $sofar;
	$sofar = $analyzer->progress;
}

close $log;

print $frameNum." frames \n";
1;
