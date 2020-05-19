# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

```bash
# 覆盖
telepresence --namespace wohuitao --swap-deployment crontab-web --expose 8000 \
--run yarn start:dev --port=8000
# 创建新的
telepresence --namespace wohuitao --new-deployment crontab-web --expose 8000 \
--run yarn start:dev --port=8000
```

```bash
kubectl delete -n wohuitao deployment crontab-web
kubectl delete -n wohuitao service crontab-web
```

```bash
秒    分钟    小时    日    月    年
*/10  *       *      *    *      *
```
