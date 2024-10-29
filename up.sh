export S3_BUCKET='dev-forte-spa-cloudfront'
export PROFILE='forteglobal'

next build && next export 
cd ./out
aws s3 cp . s3://${S3_BUCKET}/ --recursive --profile=${PROFILE}  --exclude="*.html" --exclude=".git/*" --acl=public-read --cache-control max-age=7776000,public
aws s3 cp . s3://${S3_BUCKET}/ --recursive --profile=${PROFILE}  --exclude "*" --include="*.html" --acl=public-read --cache-control max-age=600,public



find . -type f -name '*.html' | while read HTMLFILE; do
  HTMLFILESHORT=${HTMLFILE:2}
  #echo $HTMLFILE
  #echo $HTMLFILESHORT

  if [[ ${#HTMLFILESHORT} > 10 ]];
  then
    HTMLFILE_WITHOUT_INDEX=${HTMLFILESHORT::${#HTMLFILESHORT}-11}

    # cp /about/index.html to /about
    aws s3 cp s3://$S3_BUCKET/${HTMLFILESHORT} \
      s3://$S3_BUCKET/$HTMLFILE_WITHOUT_INDEX \
      --profile=${PROFILE} --acl public-read  --cache-control max-age=600,public

    if [ $? -ne 0 ]; then
      echo "***** Failed renaming build to $S3_BUCKET/$NAMESPACE (html)"
      exit 1
    fi
  fi
done

cd ..