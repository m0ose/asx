#!/usr/bin/env sh

dirs=$@
for dir in $dirs; do
  if [ ! -d $dir ] ; then
    echo 'argument is not a directory:' $dir
    exit
  fi
  todir=`echo $dir | sed 's:/src::;s:^.*/:libs/src/:'`
  echo '    ' $dir $todir
  cp -Rp $dir $todir
done

# dir=$1
# if [ ! -d $dir ] ; then
#   echo 'argument is not a directory:' $dir
#   exit
# fi
#
# cd $dir
# echo $dir
# pwd

# files=`ls *.js`
# for file in $files; do
#   echo '    ' $file
#   sed '
#     /^import/{
#       s:^import *::
#       s: from.*::
#       s:\(^.*$\):\1 \1:
#       s: : = AS.:
#       s:^:const :
#     }
#   ' < $file > ../scripts/$file
# done
