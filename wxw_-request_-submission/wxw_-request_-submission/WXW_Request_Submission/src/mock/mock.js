import Mock from 'mockjs';

const taskData = Mock.mock({
  'data|20': [
    {
      'id|+1': 1,
      'date': "@date('yyyy-MM-dd')",
      'deadline': "@date('yyyy-MM-dd')",
      'taskName': '@ctitle(3, 5)',
      'adminer': '@cname()',
      'tag|1': [ '进行中', '已完成', '被打回', '待审核'],
      'requirement': '@cparagraph(1, 3)',
      'attachmentFiles': '@word(20,25)',
    },
  ],
});

Mock.mock('/api/task', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: taskData.data,
  };
});

const mainTaskData = Mock.mock({
  'data|30': [
    {
      'id|+1': 1,
      'date': "@date('yyyy-MM-dd')",
      'deadline': "@date('yyyy-MM-dd')",
      'taskName': '@ctitle(3, 5)',
      'teacher': '@cname()',
      'department': '@cword(3,5)',
      'requirement': '@cparagraph(1, 3)',
      'attachments': '@word(20,25)',
      'phoneNumber': '@integer(13000000000, 13999999999)',
      'address': '@cword(10,20)',
      'tag|1': ['待受理', '进行中', '已完成'],
    },
  ],
});

Mock.mock('/api/mainTask', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: mainTaskData.data,
  };
});

const DetailData = Mock.mock({
  'data|1-5': [
    {
      'CreateDate': "@date('yyyy-MM-dd')",
      'name': '@cname()',
      'tag|1': ['待审核', '进行中', '已完成', '已打回'],
      'dataLine':'@date("yyyy-MM-dd")',
      'requirement': '@cparagraph(1, 3)',
      'taskName': '@ctitle(3, 5)',
    },
  ],
});

Mock.mock('/api/Detail', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: DetailData.data,
  };
});
