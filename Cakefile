settings = 
  css_options: 
    compatibility: 'ie7'
    keepSpecialComments: 0
  output_options: 
    ascii_only: true, quote_keys: true, bracketize: true
  compressor_options:
    drop_debugger: true, dead_code: true, comparisons: true
    unused: true, loops: true, if_return: true, join_vars: true
    negate_iife: true

conf =
  encoding: 'utf8'
  buildDir: 'build'
  tplDir: 'src/views'
  pageDir: 'src/pages'
  cssDir: 'src/css'
  dataDir: 'src/data'
  fontDir: 'src/assets/fonts'
  imgDir: 'src/assets/images'
  scriptsLibDir: 'src/js/lib'
  scriptsCoreDir: 
    main       : 'src/js/core'
    helpers    : 'src/js/core/helpers'
    views      : 'src/js/core/views'
    collections: 'src/js/core/collections'
  product: 'default'
  buildInfo: ".build"
  verbose: true

buildType =
  dev: 'dev'
  min: 'min'

path =
  dataBuildDir: "#{conf.buildDir}/data"
  jsBuildDir: "#{conf.buildDir}/js"
  jsBuild: "#{conf.buildDir}/js/#{conf.product}.min.js"
  tplBuild: "#{conf.buildDir}/js/compiled-templates.js"
  cssBuildDir: "#{conf.buildDir}/css"
  cssBuild: "#{conf.buildDir}/css/#{conf.product}.min.css"
  imgBuildDir: "#{conf.buildDir}/images"
  fontBuildDir: "#{conf.buildDir}/fonts"

requireOne = (one) -> (requireAll one)[0]
requireAll = ->
  for module in arguments
    try
      require module
    catch e
      console.error "Could not load #{module} - please ensure that it has been installed via npm."
      process.exit 1

[Q, fs, cp, clean_css, uglify] = requireAll 'q', 'fs', 'child_process', 'clean-css', 'uglify-js'

templater =
  dust: requireOne 'dustjs-linkedin'

write =
  err: (data) -> console.error data.toString()
  out: (data) -> console.log data.toString()

_tpl = (engine, template, name) -> 
  if templater[engine]?.compile?
    templater[engine].compile template, name
  else
    console.error "Unknown templating engine '#{engine}'"

compileTpl = (callback) ->
  console.log "Compiling templates:"
  ensureFolderExists "#{conf.buildDir}/js", conf.tplDir
  templateJS = ''
  files = readdirRecursive conf.tplDir
  for file in files
    [subFolders..., lfile] = file.split /\//g
    [namechunks..., engine, language] = lfile.split /\./g
    name = namechunks.join '_'
    friendlyName = ((chunk.replace /([A-Z])/g, (cap) -> " #{cap.toLowerCase()}") for chunk in (namechunks.reverse().join ' ')).join ''
    console.log "\tCompiling template #{friendlyName}..."
    tplFile = file
    
    try
      fileContent = fs.readFileSync tplFile, conf.encoding
    catch e
      console.error "Could not read template file:", tplFile, e
      process.exit 1

    try
      template = _tpl engine, fileContent, name
    catch e
      console.error "Could not compile template: ", name, e
      process.exit 1
    
    templateJS += template if template

  # Add version info
  console.log "Compiled templates for build #{getBuild().localBuild + 1}"
  templateJS += ";jQuery(function(){ window.version = #{JSON.stringify incBuild()}; });"

  # Write it out
  ensureFolderExists conf.buildDir
  fs.writeFileSync path.tplBuild, templateJS, conf.encoding
  callback?()

buildHTML = (callback) ->
  ensureFoldersExists conf.pageDir, conf.buildDir
  files = fs.readdirSync(conf.pageDir).sort()
  todo = files.length
  console.log "Building pages:"
  buildHTMLPage file, getVersionInfoForHTML(buildType.min) for file in files
  buildHTMLPage file, getVersionInfoForHTML(buildType.dev) for file in files

  moveAssets()
  callback?()

getVersionInfoForHTML = (type) ->
  versionInfo = 
    version: getBuild()
    conf: conf
    root: '/'
    type: type

buildHTMLPage = (file, versionInfo) ->
  fileName = "#{file}"

  if versionInfo.type == buildType.dev
    arr = fileName.split('.')
    fileName = arr[0] + '.' + versionInfo.type + '.' + arr[1]

  console.log "\tBuilding HTML #{fileName}..."
  tplFile = "#{conf.pageDir}/#{file}"
  
  fileName = conf.buildDir + '/' + fileName
  try
    fileContent = fs.readFileSync tplFile, conf.encoding
  catch e
    console.error "Could not read page:", tplFile, e
    process.exit 1

  try
    input = templater.dust.renderSource fileContent, versionInfo, (error, output) ->
      if err?
        write.err err
      else
        fs.writeFileSync fileName, output, conf.encoding
  catch e
    console.log "An error occurred while rendering the page:", file, e

# Generates a minified version of the developer build using uglify.js
compileJs = (callback) ->
  jsLib  = readdirRecursive conf.scriptsLibDir
  jsCore = readdirRecursive(conf.scriptsCoreDir.helpers)
            .concat(readdirRecursive(conf.scriptsCoreDir.collections))
            .concat(readdirRecursive(conf.scriptsCoreDir.views))
            .concat(readdir(conf.scriptsCoreDir.main))

  jsFiles = jsLib.concat path.tplBuild
  jsFiles = jsFiles.concat jsCore
  
  task = Q.defer()
  todo = []
  todo.push concatFiles jsFiles if jsFiles?.length

  out = path.jsBuild

  Q.all(todo).then(
    (output) ->
      todo = []
      todo.push jsMinify(output.join("\n"), out, true)
      Q.all(todo).then task.resolve, task.reject
    (err) -> task.reject err
  ).then -> callback?()
  task.promise

jsMinify = (inputFiles, out, fromString = false) ->
  console.log "JS Minification Started!" if conf.verbose
  ensureFolderExists out if out?
  task = Q.defer()
  minify = (output, out) ->
    if out
      arr = out.split('/'); ab = arr.pop()
      ensureFolderExists om = [ arr.join('/'), ab.split('.')[0] + ".dev.js" ].join('/')
      fs.writeFile om, output, conf.encoding, ->
        console.log "JS Developer Build Done! - #{om}" if conf.verbose
    
        options =
          compress: settings.compressor_options
          output: settings.output_options

        min = uglify.minify om, options
        fs.writeFile "#{out}", min.code, conf.encoding, ->
          console.log "JS Minification Done! - #{out}" if conf.verbose 
          task.resolve min.code

    task.promise

  return minify inputFiles, out if fromString

compileStyles = (callback) ->
  console.log "Compiling stylesheets..."

  less = []
  css = readdirRecursive conf.cssDir

  cssLessMinify(css, less, path.cssBuild, true)
  .then -> callback?()

concatFiles = (inputFiles, fn) ->
  if typeof inputFiles is 'string' then inputFiles = [inputFiles]
  if typeof fn isnt 'function' then fn = (file) -> file

  task = Q.defer()

  # Concatenate the source files
  output = ("\n\n/**#{f}**/\n" + (fn (fs.readFileSync f, conf.encoding).trim()) for f in inputFiles)
  
  task.resolve output.join "\n"
  task.promise

cssMinify = (inputFiles, out, fromString = false) ->
  console.log "CSS Minification Started!" if conf.verbose
  ensureFolderExists out if out?
  task = Q.defer()
  minify = (output, out) ->
    min = new clean_css(settings.css_options)
      .minify(output) # ?.replace(/(\})/g, ';}')
    task.resolve min unless out

    if out
      arr = out.split('/'); ab = arr.pop()
      ensureFolderExists om = [ arr.join('/'), ab.split('.')[0] + ".dev.css" ].join('/')
      fs.writeFile om, output, conf.encoding, ->
        console.log "CSS Developer Build Done! - #{om}" if conf.verbose
    
    if out then fs.writeFile "#{out}", min, conf.encoding, ->
      console.log "CSS Minification Done! - #{out}" if conf.verbose 
      task.resolve min

    task.promise

  return minify inputFiles, out if fromString

cssLessMinify = (cssFiles, lessFiles, out) ->
  task = Q.defer()
  todo = []
  todo.push concatFiles cssFiles if cssFiles?.length

  Q.all(todo).then(
    (output) ->
      todo = []
      todo.push cssMinify(output.join("\n"), out, true)
      Q.all(todo).then task.resolve, task.reject
    (err) -> task.reject err
  )
  task.promise

# Returns build information
getBuild = ->
  try
    JSON.parse fs.readFileSync conf.buildInfo, conf.encoding
  catch e
    { localBuild: 0 }

# Increments and writes the build number to a file
incBuild = ->
  info = getBuild()
  info.localBuild++
  info.timestamp = Date.now()
  try
    ensureFolderExists conf.buildDir
    fs.writeFileSync conf.buildInfo, JSON.stringify(info), conf.encoding
  catch e
    console.error "Could not write to #{conf.buildInfo}!", e
  info

ensureFolderExists = (folderPath) ->
  folders = folderPath.split /\//g

  if folderPath.charAt(0) is "/" 
    folders.shift()
    folders[0] = "/#{folders[0]}"

  incPath = []
  last = folders[folders.length - 1]

  if last.indexOf(".") isnt -1 then folders.pop()

  for name in folders
    if not name or name.trim() is '' then continue
    incPath.push name
    #console.log "\tEnsuring Folder #{incPath.join '/'} exists..." if conf.verbose
    try
      fs.mkdirSync incPath.join '/'
    catch e
      if e.code is 'EEXIST'
        #console.log "\tFolder #{incPath.join '/'} already exists" if conf.verbose
        continue
      console.error "Could not create #{incPath.join '/'}", e

# Ensures that a folder exists
ensureFoldersExists = ->
  return no unless arguments?.length
  for folderPath in arguments
    ensureFolderExists folderPath, true

readdirRecursive = (path) ->
  outFiles = []
  files = fs.readdirSync path
  for file in files
    fullPath = "#{path}/#{file}"
    info = fs.lstatSync fullPath
    if info.isDirectory()
      outFiles = outFiles.concat readdirRecursive fullPath
    else
      outFiles.push fullPath
  return outFiles

readdir = (path) ->
  outFiles = []
  files = fs.readdirSync path
  for file in files
    fullPath = "#{path}/#{file}"
    info = fs.lstatSync fullPath
    if not info.isDirectory()
      outFiles.push fullPath    
  return outFiles

readDirectories = (dirPath) ->
  directories = [dirPath]
  localFolder = fs.readdirSync dirPath
  for file in localFolder
    filePath = "#{dirPath}/#{file}"
    fileInfo = fs.lstatSync filePath
    if fileInfo.isDirectory()
      directories = directories.concat readDirectories filePath
  return directories

moveAssets = (callback) ->
  copyAsset conf.imgDir, path.imgBuildDir
  copyAsset conf.fontDir, path.fontBuildDir
  copyAsset conf.dataDir, path.dataBuildDir

# Wrapper around the 'cp -r' action
copyAsset = (from, to, callback) ->
  console.log "Copying assets..."

  # Make a promise

  # Launch the copy process
  c = cp.exec "cp -Rv #{from} #{to}"

  # When we're done, resolve the promise
  c.on 'exit', (code) ->  
    if code is 0
      console.log "Assets Copied Done!"
      callback?()
    else
      console.log "\tFailed to copy asset (#{from}); exit code:", code
      process.exit 1

  # Return the promise
  task.promise

# Delete all files from build folder
deleteBuild = (callback) ->
  c = cp.exec "rm -rf #{conf.buildDir}"

  c.on 'exit', (code) ->
    if code is 0
      console.log "Build Folder Deleted!"
      callback?()
    else
      console.log "\tFailed to delete BuildFolder; exit code:", code
      process.exit 1

clearBuildFolder = (callback) ->
  fs.unlinkSync(path.tplBuild);
  callback?()

task 'all', 'Compiles templates, then build the HTML', -> deleteBuild -> compileStyles -> compileTpl -> compileJs -> buildHTML -> clearBuildFolder -> console.log "DONE!"