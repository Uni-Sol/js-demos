#!/usr/bin/perl
use warnings;
use strict;
use feature ':5.14';
#use Math::BigFloat;

use Audio::Analyzer;

my ( $source, $analyzer, $log, $complete, @pcm, @freqs, @fft, $frameNum, $sampleNum, $frameSampleNum );
$source = $ARGV[0] || '../audio/TONES001.wav';
$analyzer = Audio::Analyzer->new(
	  file => $source,
	  channels => 1,
	  bits_per_sample => 16,
	  sample_rate => 44100,
	  fps => 15
	);
open $log, '>analyzer.log';
print $log <<TXT;
var sBuffer = ['pcm,frequency,magnitude'];
TXT
$complete = 0;
$frameNum = 0;
$sampleNum = 0;
$frameSampleNum = 0;

while( defined(my $chunk = $analyzer->next) ) {
	my $sofar = $analyzer->progress;
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
		
		#print $source .', s:'.$sampleNum .', f:'. $frameSampleNum .', frame'. $frameNum." \n";
		my $v = ($pcm[$i] / 65536);
		#$v = Math::BigFloat->new($v);
		#$v->ffround(-3);
		my $f = $freqs[$i];
		#$f = Math::BigFloat->new($f);
		#$f->ffround(0);
		my $m = $fft[$i];
		#$m = Math::BigFloat->new($m);
		#$m->ffround(-3);
		print $log "\'". join( ",", ($v, $f, $m) ) ."\',\n";
	}
	print $log <<TXT;
]);
TXT

	$frameNum++;
	$frameSampleNum = 0;
	print $sofar ."%\n" if( $sofar > $complete );
	$complete = $sofar;
}

print $frameNum." frames \n";
close $log;