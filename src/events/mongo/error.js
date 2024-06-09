module.exports = {
    name: 'err',
    async execute(err) {
        const chalk = await import('chalk');
        console.log(chalk.default.red(`[Database Status] Database error:\n${err}`));
    }
}