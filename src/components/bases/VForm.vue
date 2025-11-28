<script lang="ts" setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { computed, ref, watch, nextTick } from 'vue';
import { emailSchema, passwordSchema, usernameSchema } from '@/schemas/common.schema';
import type { FormItemConfig, FormProps } from '@/types/components/Base'



const props = withDefaults(defineProps<FormProps>(), {
  config: () => ({
    layout: 'vertical',
    showSubmit: true,
    showReset: false,
    size: 'medium',
    validateOnChange: true,
    validateOnBlur: true,
  }),
  items: () => [],
  initialValues: () => ({}),
  loading: false,
  disabled: false,
  onReset: () => {},
  onChange: () => {},
  onValidate: () => {},
})

// 根据表单类型生成表单配置项
const defaultFormItems = computed<FormItemConfig[]>(() => {
  const baseItems: FormItemConfig[] = [
    {
      name: 'email',
      label: '邮箱地址',
      type: 'email',
      prefixIcon: 'email',
      placeholder: 'your@emial.com',
      required: true,
      validation: emailSchema
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      prefixIcon: 'password',
      placeholder: '请输入密码',
      required: true,
      validation: passwordSchema
    }
  ]
  if (props.formType === 'register') {
    return [
      {
        name: 'nickname',
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        required: true,
        validation: usernameSchema
      },
      {
        name: 'email',
        label: '邮箱地址',
        type: 'email',
        prefixIcon: 'email',
        placeholder: '请输入邮箱',
        required: true,
        validation: emailSchema
      },
      {
        name: 'code',
        label: '验证码',
        type: 'text',
        placeholder: '请输入验证码',
        required: true,
        validation: z.string()
          .length(6, '验证码必须是6位')
          .regex(/^\d+$/, '验证码只能是数字'),
        colSpan: 1,
      },
      {
        name: 'password',
        label: '密码',
        type: 'tel',
        placeholder: '请输入密码',
        required: true,
        validation: passwordSchema
      },
      {
        name: 'confirmPassword',
        label: '确认密码',
        type: 'password',
        prefixIcon: 'password',
        placeholder: '请输入确认密码',
        required: true,
        validation: z.string().min(6, '密码长度不能小于6位').max(20, '密码长度不能大于20位'),
      },
      {
        name: 'agreement',
        label: '同意协议',
        type: 'checkbox',
        required: true,
        validation: z.boolean().refine(val => val === true, '必须同意用户协议'),
      },
    ]
  }

  // 登录表单额外字段
  if (props.formType === 'login') {
    return [
      ...baseItems,
      {
        name: 'remember',
        label: '记住我',
        type: 'checkbox',
        required: false,
      },
    ]
  }

  return baseItems
})

// 合并默认配置和传入配置
const formItems = computed<FormItemConfig[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }
  return defaultFormItems.value
})

// 根据表单项生成验证Schema
const formSchema = computed(() => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  formItems.value.forEach(item => {
    if (item.validation) {
      schemaFields[item.name] = item.validation
    } else if (item.required) {
      // 默认验证规则
      switch (item.type) {
        case 'email':
          schemaFields[item.name] = emailSchema
          break
        case 'number':
          schemaFields[item.name] = z.number().min(1, `${item.label}是必填项`)
          break
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'url':
        case 'textarea':
        case 'select':
        case 'checkbox':
          schemaFields[item.name] = z.boolean().refine(val => val === true, `${item.label}是必填项`)
          break;
        case 'radio':
        case 'switch':
        case 'date':
        case 'time':
        case 'datetime':
        case 'file':
        case 'color':
        default:
          schemaFields[item.name] = z.string().min(1, `${item.label}是必填项`)
      }
    } else {
      // 非必填字段
      switch (item.type) {
        case 'number':
          schemaFields[item.name] = z.number().optional()
          break
        case 'checkbox':
          schemaFields[item.name] = z.boolean().optional()
          break
        default:
          schemaFields[item.name] = z.string().optional()
      }
    }
  })
  // 添加自定义验证规则
  let schema = z.object(schemaFields)

  // 注册表单的密码确认验证
  if (props.formType === 'register') {
    schema = schema.refine(
      data=>data.password === data.confirmPassword,
      {
        message: '两次密码输入不一致',
        path: ['confirmPassword'],
      }
    )
  }

  return schema;
})

// 初始值
const initialFormValues = computed(() => {
  const values: Record<string, any> = {}
  
  formItems.value.forEach(item => {
    if (props.initialValues[item.name] !== undefined) {
      values[item.name] = props.initialValues[item.name]
    } else if (item.defaultValue !== undefined) {
      values[item.name] = item.defaultValue
    } else {
      // 根据类型设置默认值
      switch (item.type) {
        case 'checkbox':
          values[item.name] = false
          break
        case 'number':
          values[item.name] = 0
          break
        default:
          values[item.name] = ''
      }
    }
  })
  
  return values
})

// 初始化表单
const { 
  handleSubmit,
  errors,
  values,
  resetForm,
  setFieldValue,
  setFieldError,
  validate,
  validateField,
  setValues,
  meta,
} = useForm({
  validationSchema: toTypedSchema(formSchema.value),
  initialValues: initialFormValues.value,
  validateOnMount: false,
})

// 监听字段变化进行验证
watch(values, (newValues, oldValues) => {
  if (!props.config.validateOnChange) return
  
  // 找出变化的字段
  const changedFields: string[] = []
  for (const key in newValues) {
    if (newValues[key] !== oldValues[key]) {
      changedFields.push(key)
    }
  }
  
  // 验证变化的字段
  if (changedFields.length > 0) {
    nextTick(() => {
      changedFields.forEach(field => validateField(field))
    })
  }
}, { deep: true })

// 重置表单数据
const resetFormData = () => {
  resetForm()
}

// 处理 blur 事件
const handleFieldBlur = (fieldName: string) => {
  if (props.config.validateOnBlur) {
    validateField(fieldName)
  }
}

// 字段变化处理
const handleFieldChange = (field: string, value: any) => {
  props.onChange(field, value, values)
  
  // 处理依赖字段的验证
  const dependencies = formItems.value.find(item => item.name === field)?.dependencies
  if (dependencies && dependencies.length > 0) {
    nextTick(() => {
      dependencies.forEach(dep => {
        validateField(dep)
      })
    })
  }
}

// 表单提交
const submitForm = handleSubmit(async (values, { setErrors }) => {
  try {
    await props.onSubmit(values, { setErrors, resetForm })
  } catch (error) {
    console.error('表单提交错误:', error)
  }
})

// 获取验证码（仅注册）
const codeCountdown = ref<number>(0);
const getCode = async () => { 
  //先验证邮箱字段
  const emialField = formItems.value.find(item => item.name === 'email');
  if (emialField) {
    const isValid = await validateField('email');
    if (!isValid) {
      return;
    }
  }

  //? 模拟验证码发送给
  codeCountdown.value = 60;
  const timer = setInterval(() => {
    codeCountdown.value--;
    if (codeCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  //? 发送验证码
  console.log('发送验证码', values.email);
}

// 计算表单类名
const formClass = computed(() => {
  return [
    'form-base',
    `form-base--${props.config.layout}`,
    `form-base--${props.config.size}`,
    {
      'form-base--inline': props.config.inline,
      'form-base--disabled': props.disabled,
      'form-base--loading': props.loading,
    }
  ]
})

// 计算表单样式
const formStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (props.config.gap) {
    styles.gap = props.config.gap
  }
  return styles
})

// 计算表单项样式
const getFieldStyle = (field: FormItemConfig) => {
  const styles: Record<string, string> = {}
  if (props.config.gridColumns && field.colSpan) {
    styles.gridColumn = `span ${field.colSpan}`
  }
  return styles
}

// 暴露方法给父组件
defineExpose({
  validate,
  resetForm: resetForm,
  setFieldValue,
  setFieldError,
  setValues,
  getValues: () => values,
  getErrors: () => errors,
  submit: submitForm,
})
</script>

<template>
  <form 
    class="form-base"
    :class="formClass"
    @submit.prevent="submitForm"
    @reset.prevent="resetFormData"
    novalidate
  >
    <div 
      class="form-base__fields"
      :class="{
        'form-base__fields--grid': config.gridColumns
      }"
      :style="{
        gridTemplateColumns: config.gridColumns ? `repeat(${config.gridColumns}, 1fr)` : undefined
      }"
    >
      <div 
        class="form-base__field"
        v-for="item in formItems.filter(f => !f.hidden)"
        :key="item.name"
        :class="[
          `form-base__field--${item.type}`,
          {
            'form-base__field--required': item.required,
            'form-base__field--disabled': item.disabled || disabled,
            'form-base__field--error': errors[item.name],
          }
        ]"
        :style="getFieldStyle(item)"
      >
        <label 
          v-if="
            item.label
            && config.layout != 'inline'
            && item.type !== 'checkbox'
            && item.type !== 'switch'
            && item.type !== 'radio'
          "
          :for="item.name"
          :style="{
            width: config.labelWidth,
            textAlign: config.labelAlign
          }"
          class="form-base__label"
        >
          {{ item.label }}
          <span v-if="config.colon">:</span>
        </label>

        <!-- 表单项控件 -->
        <div class="form-base__control">
          <!-- 文本输入框 -->
          <div v-if="['text', 'email', 'password', 'number', 'tel', 'url'].includes(item.type)" class="form-base__input-wrapper">
            <!-- 前缀图标 -->
            <span v-if="item.prefixIcon" class="form-base__prefix-icon">
              <Icon :name="item.prefixIcon"/>
            </span>
            
            <Field
              :id="item.name"
              :name="item.name"
              :type="item.type"
              :placeholder="item.placeholder"
              :disabled="item.disabled || disabled || loading"
              :readonly="item.readonly"
              class="form-base__input"
              v-bind="item.attrs"
              @blur="handleFieldBlur(item.name)"
            />
            <!-- 后缀图标 -->
            <span v-if="item.suffixIcon" class="form-base__suffix-icon">
              <Icon :name="item.suffixIcon"/>
            </span>
            <!-- 验证码按钮 -->
            <button
              v-if="item.name === 'code' && formType === 'register'"
              type="button"
              class="form-base__code-btn"
              :disabled="codeCountdown > 0 || !values.email"
              @click="getCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s后重新获取` : '获取验证码' }}
            </button>
          </div>
          <!-- 文本域 -->
          <Field
            v-else-if="item.type === 'textarea'"
            :id="item.name"
            :name="item.name"
            as="textarea"
            :placeholder="item.placeholder"
            :disabled="item.disabled || disabled || loading"
            :readonly="item.readonly"
            class="form-base__textarea"
            v-bind="item.attrs"
            @blur="handleFieldBlur(item.name)"
            @change="handleFieldChange(item.name, $event.target.value)"
          />
          <!-- 下拉选择 -->
          <Field
            v-else-if="item.type === 'select'"
            :id="item.name"
            :name="item.name"
            as="select"
            :disabled="item.disabled || disabled || loading"
            class="form-base__select"
            v-bind="item.attrs"
            @blur="handleFieldBlur(item.name)"
            @change="handleFieldChange(item.name, $event.target.value)"
          >
            <option 
              v-if="item.placeholder" 
              value=""
              disabled
            >
              {{ item.placeholder }}
            </option>
            <option
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </Field>

          <!-- 复选框 -->
          <label v-else-if="item.type === 'checkbox'" class="form-base__checkbox">
            <Field
              :id="item.name"
              :name="item.name"
              type="checkbox"
              :value="item.attrs?.value || true"
              :disabled="item.disabled || disabled || loading"
              class="form-base__checkbox-input"
              v-bind="item.attrs"
              @blur="handleFieldBlur(item.name)"
              @change="handleFieldChange(item.name, $event.target.checked)"
            />
            <span class="form-base__checkbox-label">{{ item.label }}</span>
          </label>

          <!-- 单选框组 -->
          <div v-else-if="item.type === 'radio'" class="form-base__radio-group">
            <label
              v-for="option in item.options"
              :key="option.value"
              class="form-base__radio"
            >
              <Field
                :id="`${item.name}-${option.value}`"
                :name="item.name"
                type="radio"
                :value="option.value"
                :disabled="option.disabled || item.disabled || disabled || loading"
                class="form-base__radio-input"
                @blur="handleFieldBlur(item.name)"
                @change="handleFieldChange(item.name, option.value)"
              />
              <span class="form-base__radio-label">{{ option.label }}</span>
            </label>
          </div>

          <!-- 开关 -->
          <label v-else-if="item.type === 'switch'" class="form-base__switch">
            <Field
              :id="item.name"
              :name="item.name"
              type="checkbox"
              :value="item.attrs?.value || true"
              :disabled="item.disabled || disabled || loading"
              class="form-base__switch-input"
              v-bind="item.attrs"
              @blur="handleFieldBlur(item.name)"
              @change="handleFieldChange(item.name, $event.target.checked)"
            />
            <span class="form-base__switch-slider"></span>
            <span v-if="item.label && config.layout === 'inline'" class="form-base__switch-label">
              {{ item.label }}
            </span>
          </label>

          <!-- 日期时间选择 -->
          <Field
            v-else-if="['date', 'time', 'datetime'].includes(item.type)"
            :id="item.name"
            :name="item.name"
            :type="item.type === 'datetime' ? 'datetime-local' : item.type"
            :placeholder="item.placeholder"
            :disabled="item.disabled || disabled || loading"
            :readonly="item.readonly"
            class="form-base__date"
            v-bind="item.attrs"
            @blur="handleFieldBlur(item.name)"
            @change="handleFieldChange(item.name, $event.target.value)"
          />

          <!-- 文件上传 -->
          <Field
            v-else-if="item.type === 'file'"
            :id="item.name"
            :name="item.name"
            type="file"
            :disabled="item.disabled || disabled || loading"
            class="form-base__file"
            v-bind="item.attrs"
            @blur="handleFieldBlur(item.name)"
            @change="handleFieldChange(item.name, $event.target.files)"
          />
          <!-- 自定义组件 -->
          <component
            v-else-if="item.type === 'custom' && item.customComponent"
            :is="item.customComponent"
            :id="item.name"
            :name="item.name"
            :modelValue="values[item.name]"
            :field="item"
            :disabled="item.disabled || disabled || loading"
            @blur="handleFieldBlur(item.name)"
            @update:modelValue="(value: any) => {
              setFieldValue(item.name, value)
              handleFieldChange(item.name, value)
            }"
          />
          <!-- 错误提示 -->
          <ErrorMessage
            :name="item.name"
            class="form-base__error"
          />
          <!-- 帮助文本 -->
          <div v-if="item.helpText" class="form-base__help">
            {{ item.helpText }}
          </div>
        </div>
      </div>
    </div>
    <!-- 表单操作 -->
    <div v-if="config.showSubmit || config.showReset" class="form-base__actions">
      <VButton 
        v-if="config.showSubmit"
        size="large"
        :disabled="disabled || loading || !meta.valid"
        border
        block="true"
      >
        <span v-if="loading" class="form-base__loading"></span>
        {{ config.submitText || (formType === 'login' ? '登录' : formType === 'register' ? '注册' : '提交') }}
      </VButton>
      <VButton 
        v-if="config.showReset"
        type="secondary" 
        :disabled="disabled || loading"
        border
      >
        {{ config.resetText || '重置' }}
      </VButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.form-base {
  width: 100%;
  &__fields {
    width: 100%;
    @include mix.flex-box($d: column, $a: flex-start, $g: lg);
    @include mix.margin-d(b, xxl);
    @include mix.respond-down(xs) {
      @include mix.gap(0);
    }
    &--grid {
      display: grid;
      @include mix.gap(md);
    }
  }
  &__field {
    position: relative;
    width: 100%;
    @include mix.padding-d(b, xl);
    &--require {
      .form-base__label::after {
        content: '*';
        @include mix.margin-d(l, xs);
        @include mix.font-style($c: var(--text-subtler));
      }
    }
    &--disabled {
      opacity: .6;
      pointer-events: none;
    }
    &--error {
      .form-base__input,
      .form-base__textarea,
      .form-base__select,
      .form-base__date {
        border-color: var(--red-base);
        &:focus {
          border-color: var(--red-base);
          box-shadow: 0 0 0 2px rgba(var(--red-rgb), 0.1);
        }
      }
    }
  }
  &__label {
    display: inline-block;
    @include mix.font-style($s: md,$c: var(--text-subtle));
    @include mix.margin-d(b, sm);
  }
  &__input-wrapper {
    width: 100%;
    @include mix.container-style($b: var(--border-base), $r: md, $bg: var(--bg-base));
    @include mix.flex-box($g: sm);
    @include mix.font-style($s: lg, $c: var(--text-subtle));
    @include anim.transition($p: border-color box-shadow);
    &:focus-within {
      border-color: var(--primary-base);
      box-shadow: 0 0 0 4px var(--primary-weak);
    }
  }
  &__input {

  }
  &__prefix-icon,
  &__suffix-icon {
    @include mix.font-style($c: inherit, $s: xxl);
  }
  &__error {
    @include mix.position-style($p: absolute, $b: 0);
    @include mix.font-style($c: var(--red-subtle));
  }
  &__control {
    width: 100%;
    @include mix.flex-box($j: flex-start);
  }
  &__checkbox {
    @include mix.flex-box($j: flex-start, $w: nowrap, $g: sm);
    &-label {
      text-wrap: nowrap;
      @include mix.font-style($s: lg);
      @include hov.color(var(--primary-base), true);
    }
    &-input {
      @include mix.size(20px);
    }
  }
  &__textarea {
    width: 100%;
    @include mix.container-style($b: var(--border-base), $r: md, $bg: var(--bg-base));
    @include mix.padding(sm);
    @include mix.font-style($s: lg, $c: var(--text-base));
    resize: vertical;
    min-height: 80px;
    border: none;
    outline: none;
    &:focus {
      outline: none;
      border-color: var(--primary-base);
    }
  }
  &__date {
    width: 100%;
    @include mix.container-style($b: var(--border-base), $r: md, $bg: var(--bg-base));
    @include mix.padding(sm);
    @include mix.font-style($s: lg, $c: var(--text-base));
    border: none;
    outline: none;
    
    &:focus {
      outline: none;
      border-color: var(--primary-base);
    }
  }
  
  &__file {
    width: 100%;
    @include mix.padding(sm);
    @include mix.font-style($s: lg, $c: var(--text-base));
  }
  
  &__code-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    @include mix.container-style($b: none, $r: sm, $bg: var(--primary-base));
    @include mix.padding(xs sm);
    @include mix.font-style($s: sm, $c: white, $w: 500);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
    
    &:disabled {
      background: var(--bg-subtle);
      color: var(--text-muted);
      cursor: not-allowed;
    }
  }
  
  &__checkbox {
    @include mix.flex-box($j: flex-start, $w: nowrap, $g: sm);
    
    &-label {
      text-wrap: nowrap;
      @include mix.font-style($s: lg, $c: var(--text-subtle));
      @include hov.color(var(--primary-base), true);
    }
    
    &-input {
      @include mix.size(20px);
      accent-color: var(--primary-base);
    }
  }
  
  &__radio-group {
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
  }
  
  &__radio {
    @include mix.flex-box($j: flex-start, $w: nowrap, $g: sm);
    
    &-label {
      text-wrap: nowrap;
      @include mix.font-style($s: lg, $c: var(--text-subtle));
      @include hov.color(var(--primary-base), true);
    }
    
    &-input {
      @include mix.size(20px);
      accent-color: var(--primary-base);
    }
  }
  
  &__switch {
    @include mix.flex-box($j: flex-start, $w: nowrap, $g: sm);
    position: relative;
    cursor: pointer;
    
    &-input {
      display: none;
      
      &:checked + .form-base__switch-slider {
        background-color: var(--primary-base);
        
        &::before {
          transform: translateX(20px);
        }
      }
      
      &:disabled + .form-base__switch-slider {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    
    &-slider {
      position: relative;
      width: 44px;
      height: 24px;
      background-color: var(--border-base);
      border-radius: 24px;
      transition: all 0.3s;
      
      &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        transition: all 0.3s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }
    
    &-label {
      @include mix.font-style($s: lg, $c: var(--text-subtle));
      @include hov.color(var(--primary-base), true);
    }
  }
  &__help {
    @include mix.margin-d(t, sm);
    @include mix.font-style($s: sm, $c: var(--text-weak));
    line-height: 1.4;
  }
  
  &__actions {
    @include mix.margin-d(t, xl);
    @include mix.padding-d(t, md);
    display: flex;
    gap: 12px;
    border-top: 1px solid var(--border-base);
    
    @include mix.respond-down(sm) {
      flex-direction: column;
    }
  }
  
  &__loading {
    @include mix.size(16px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  
  // ---------- layout ----------
  &--vertical {
    .form-base__field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-base__label {
      @include mix.font-style($w: 500, $c: var(--text-base));
    }
  }
  
  &--horizontal {
    .form-base__field {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      
      @include mix.respond-down(sm) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
    }
    
    .form-base__label {
      @include mix.font-style($w: 500, $c: var(--text-base));
      flex-shrink: 0;
      text-align: v-bind('config.labelAlign || "right"');
      padding-top: 8px;
      width: v-bind('config.labelWidth || "auto"');
      
      @include mix.respond-down(sm) {
        text-align: left;
        padding-top: 0;
        width: auto;
      }
    }
    
    .form-base__control {
      flex: 1;
    }
  }
  
  &--inline {
    .form-base__fields {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 16px;
    }
    
    .form-base__field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0;
      flex: 1;
      min-width: 200px;
      
      @include mix.respond-down(md) {
        min-width: 150px;
      }
      
      @include mix.respond-down(sm) {
        min-width: 100%;
      }
    }
    
    .form-base__label {
      flex-shrink: 0;
      @include mix.font-style($w: 500, $c: var(--text-base));
      white-space: nowrap;
    }
  }
  
  // ---------- size ----------
  &--small {
    font-size: 12px;
    
    .form-base__input,
    .form-base__textarea,
    .form-base__select,
    .form-base__date {
      padding: 6px 10px;
      font-size: 12px;
    }
    
    .form-base__label {
      font-size: 12px;
    }
  }
  
  &--medium {
    font-size: 14px;
    .form-base__input,
    .form-base__textarea,
    .form-base__select,
    .form-base__date {
      padding: 8px 12px;
      font-size: 14px;
    }
    .form-base__label {
      font-size: 14px;
    }
  }
  
  &--large {
    font-size: 16px;
    .form-base__input,
    .form-base__textarea,
    .form-base__select,
    .form-base__date {
      padding: 12px 16px;
      font-size: 16px;
    }
    .form-base__label {
      font-size: 16px;
    }
  }
  // ---------- state ----------
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  &--loading {
    .form-base__submit {
      position: relative;
      pointer-events: none;
    }
  }
  &--hidden {
    display: none;
  }
  &--visible {
    display: block;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>