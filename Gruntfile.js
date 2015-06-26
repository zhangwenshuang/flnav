module.exports = function(grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,//去掉目录
                        src: ['src/*.png'],
                        dest: '<%= pkg.dest %>/',
                        filter: 'isFile'
                    }
                ],
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '<%=pkg.src %>/<%=pkg.file %>.js',
                dest: '<%= pkg.dest %>/<%=pkg.file %>.min.js'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    '<%= pkg.dest %>/<%=pkg.file %>.min.css': '<%=pkg.src %>/<%=pkg.file %>.css'
                }
            }
        }
    });
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // css压缩
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 图片拷贝
    grunt.loadNpmTasks('grunt-contrib-copy');
    // 默认任务
    grunt.registerTask('default', ['uglify', 'cssmin', 'copy']);
}