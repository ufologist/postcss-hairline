const postcss = require('postcss');
const {
    getPseudoSelector,
    unique
} = require('./helper');

const hairlineReg = /^hairline(?:-?)(\S*)/;
const borderReg = /border(?:-top|-bottom|-left|-right|-image)?(?:-width)?$/;
const borderRadiusReg = /border-radius/;
const unitPxReg = /([0-9\.]+)(px)/;
const unitRemReg = /([0-9\.]+)(rem)/;
const pseudoReg = /:(?:before|after)$/;

const hairline = postcss.plugin('postcss-hairline', (options = {}) => (root) => {
    const {
        pxComment = 'no' // 添加注释避免边框宽度被类似 postcss-px2rem 这样的插件转成 rem 单位
    } = options;

    const hairlineRuleList = [];
    const selectors = [];

    root.walkRules((rule) => {
        const borderDecls = [];
        let borderPseudo = 'after';
        let isPositionStatic = true;

        rule.walkDecls((decl) => {
            if (borderReg.test(decl.prop) && unitPxReg.test(decl.value)) {
                const next = decl.next();
                if (next && next.type === 'comment' && hairlineReg.test(next.text.trim())) {
                    var pseudo = next.text.trim().match(hairlineReg)[1];
                    if (pseudo) {
                        borderPseudo = pseudo;
                    }

                    decl.remove();
                    borderDecls.push(decl);
                }
            }

            if (borderRadiusReg.test(decl.prop)) {
                let borderRadiusDecl;

                const next = decl.next();
                if (next && next.type === 'comment' && hairlineReg.test(next.text.trim())) {
                    // 容器圆角为R, 伪元素圆角为2R
                    if (unitPxReg.test(decl.value)) {
                        // px 单位时, 例如 750 设计稿, 20px 的圆角
                        // 容器圆角应为10px(书写20px), 伪元素圆角应为20px
                        borderRadiusDecl = decl;

                        decl.remove();
                        // 调整容器的圆角
                        rule.append(decl.clone({
                            value: decl.value.replace(unitPxReg, ($0, $1, $2) => `${parseFloat($1) / 2}${$2}`)
                        }));
                        rule.append({
                            text: pxComment
                        });
                    } else if (unitRemReg.test(decl.value)) {
                        // rem 单位时, 例如 750 设计稿, 20px 的圆角
                        // 容器圆角应为2rem, 伪元素圆角应为4rem
                        borderRadiusDecl = decl.clone({
                            value: decl.value.replace(unitRemReg, ($0, $1, $2) => `${parseFloat($1) * 2}${$2}`)
                        });
                    }

                    if (borderRadiusDecl) {
                        borderDecls.push(borderRadiusDecl);
                    }
                }
            }

            if (decl.prop === 'position' && decl.value !== 'static') {
                isPositionStatic = false;
            }
        });

        const slts = rule.selectors.filter(slt => !pseudoReg.test(slt));
        if (borderDecls.length <= 0  || slts.length <= 0) {
            return;
        }

        // 边框个性化样式
        const hairlineRule = postcss.rule({
            selector: getPseudoSelector(slts, borderPseudo, true)
        });
        borderDecls.forEach((decl) => {
            hairlineRule.append(decl);
            hairlineRule.append({
                text: pxComment
            });
        });
        hairlineRuleList.push(hairlineRule);

        // 调整当前的规则
        if (isPositionStatic) {
            rule.append({
                prop: 'position',
                value: 'relative'
            });
        }

        [].push.apply(selectors, getPseudoSelector(slts, borderPseudo));
    });

    hairlineRuleList.forEach((rule) => {
        root.append(rule);
    });

    // 创建伪元素的样式的统一样式
    if (selectors.length > 0) {
        const slts = unique(selectors);
        root.append(`
            ${slts.join(',')} {
                content: '';
                position: absolute;
                top: -50%;
                bottom: -50%;
                left: -50%;
                right: -50%;
                -webkit-transform: scale(0.5);
                        transform: scale(0.5);
                pointer-events: none;
            }
        `);
    }
});

module.exports = hairline;
