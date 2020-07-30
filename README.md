@trenskow/units
----

Small library for parsing units.

# Usage

````javascript
const
	{ bytes, duration } = require('@trenskow/units/');
````

````javascript
bytes.kib('1024b');
/* returns: 1 */

bytes.b('1kb');
/* returns: 1000 */

bytes('4kib'); /* defaults to bytes as return unit */
/* returns 4096 */
````

````javascript
duration.hours('2d');
/* returns: 48 */

duration.ms('2s');
/* return: 2000 */

duration('2h'); /* defaults to seconds as return unit */
/* returns 7200 */
````

# Supported units

## Bytes

B, EB, Ebyte, Ebytes, EiB, Eibyte, Eibytes, GB, Gbyte, Gbytes, GiB, Gibyte, Gibytes, KiB, Kibyte, Kibytes, MB, Mbyte, Mbytes, MiB, Mibyte, Mibytes, PB, Pbyte, Pbytes, PiB, Pibyte, Pibytes, TB, Tbyte, Tbytes, TiB, Tibyte, Tibytes, YB, Ybyte, Ybytes, YiB, Yibyte, Yibytes, ZB, Zbyte, Zbytes, ZiB, Zibyte, Zibytes, byte, bytes, daB, dabyte, dabytes, decaB, decabyte, decabytes, exaB, exabyte, exabytes, exbiB, exbibyte, exbibytes, gibiB, gibibyte, gibibytes, gigaB, gigabyte, gigabytes, hB, hbyte, hbytes, hectoB, hectobyte, hectobytes, kB, kbyte, kbytes, kibiB, kibibyte, kibibytes, kiloB, kilobyte, kilobytes, megaB, megabyte, megabytes, mibiB, mibibyte, mibibytes, pebiB, pebibyte, pebibytes, petaB, petabyte, petabytes, tebiB, tebibyte, tebibytes, teraB, terabyte, terabytes, yobiB, yobibyte, yobibytes, yottaB, yottabyte, yottabytes, zebiB, zebibyte, zebibytes, zettaB, zettabyte and zettabytes.

## Durations

as, asecond, aseconds, attos, attosecond, attoseconds, centis, centisecond, centiseconds, cs, csecond, cseconds, d, day, days, decis, decisecond, deciseconds, ds, dsecond, dseconds, femtos, femtosecond, femtoseconds, fs, fsecond, fseconds, h, hour, hours, m, micros, microsecond, microseconds, millis, millisecond, milliseconds, minute, minutes, ms, msecond, mseconds, nanos, nanosecond, nanoseconds, ns, nsecond, nseconds, picos, picosecond, picoseconds, ps, psecond, pseconds, s, second, seconds, w, week, weeks, y, year, years, yoctos, yoctosecond, yoctoseconds, ys, ysecond, yseconds, zeptos, zeptosecond, zeptoseconds, zs, zsecond, zseconds, μs, μsecond, μseconds

# LICENSE

2-Clause BSD License (SEE LICENSE)