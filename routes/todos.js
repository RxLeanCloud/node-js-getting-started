'use strict';
var router = require('express').Router();
var RxAV = require('rx-lean-js-core');
var Observable = require('rxjs').Observable;

// 查询 Todo 列表
router.get('/', (req, res, next) => {
  var query = new RxAV.RxAVQuery('Todo');
  query.descending('createdAt');
  query.find().subscribe(results => {
    res.render('todos', {
      title: 'TODO 列表',
      todos: results
    });
  }, err => {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('todos', {
        title: 'TODO 列表',
        todos: []
      });
    } else {
      next(err);
    }
  });
});

// 新增 Todo 项目
router.post('/', (req, res, next) => {
  var content = req.body.content;
  var todo = new RxAV.RxAVObject('Todo');
  todo.set('content', content);
  todo.save().subscribe(success => {
    res.redirect('/todos');
  });
});

module.exports = router;
