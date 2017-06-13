#!/usr/bin/env sh

dirs=`bin/pkgkey.js 'wraplibs'`

echo "wraplibs.sh"
# echo 'libes to wrap' $dirs

for dir in $dirs; do
  todir=`echo $dir | sed 's:\.min\.js:.wrapper.js:'`
  echo $dir '->' $todir
  bin/wraplib.js $dir > $todir
done
