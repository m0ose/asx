#!/usr/bin/env sh

echo $0 $1
dir=$1
if [ ! -d $dir ] ; then
  echo 'argument is not a directory:' $dir
  exit
fi

cd $dir
echo $dir
pwd

files=`ls *.js`
for file in $files; do
  echo '    ' $file
  sed '
    /^import .*dist\/AS\./{
      s:^import :const :
      s: from .*$: = AS:
    }
  ' < $file > ../scripts/$file
done
