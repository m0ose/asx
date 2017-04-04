#!/usr/bin/env bash

cd test/modules # pwd is asx, not scripts
pwd

# mkdir ../scripts
files=`ls *.js`

for file in $files; do
  echo '    ' $file
  sed '
    /^import/{
      s:^import *::
      s: from.*::
      s:\(^.*$\):\1 \1:
      s: : = AS.:
      s:^:const :
    }
  ' < $file > ../scripts/$file
  # sed '
  #   /^import/{
  #     s:src:lib:
  #   }
  # ' < $file > ../apps/$file
done
