#!/bin/bash

outputFile=full-ocr.csv
FILES=./*.txt
echo "fileName,fileContent" > $outputFile
for f in $FILES
do
    echo "\"$f\",\"\"\"" >> $outputFile
    cat $f >> $outputFile
    echo "\"\"\"" >> $outputFile
done
