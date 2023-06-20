module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'confirm',
        name: 'hasForwardRef',
        message: 'Forward ref component?',
        default: true,
      },
    ],
    actions: ({ hasForwardRef }) => {
      const componentTemplate = hasForwardRef
        ? 'forward-ref-component'
        : 'component';

      return [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: `build-tools/plop-templates/component/${componentTemplate}.tsx.hbs`,
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.module.scss',
          templateFile: `build-tools/plop-templates/component/${componentTemplate}.module.scss.hbs`,
        },
      ];
    },
  });
  plop.setGenerator('transition component', {
    description: 'Create a new React transition component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'confirm',
        name: 'hasForwardRef',
        message: 'Forward ref component?',
        default: true,
      },
    ],
    actions: ({ hasForwardRef }) => {
      const componentTemplate = hasForwardRef
        ? 'forward-ref-transition-component'
        : 'transition-component';

      return [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: `build-tools/plop-templates/transition-component/${componentTemplate}.tsx.hbs`,
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.module.scss',
          templateFile: `build-tools/plop-templates/transition-component/${componentTemplate}.module.scss.hbs`,
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/TransitionController.ts',
          templateFile: `build-tools/plop-templates/transition-component/${componentTemplate}.transition-controller.ts.hbs`,
        },
      ];
    },
  });
};
