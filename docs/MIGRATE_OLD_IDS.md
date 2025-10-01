# 迁移旧格式ID到新格式

## 背景

系统现在支持带UUID的新ID格式，但不会自动迁移现有的旧格式ID。这是为了确保数据安全和向后兼容性。

## ID格式对比

| 类型 | 旧格式 | 新格式 |
|------|--------|--------|
| Session | `session-2024-01-06` | `session-2024-01-06-a1b2c3d4` |
| Class | `class-2024-01-06-14:00` | `class-2024-01-06-14:00-a1b2c3d4` |
| Registration | `reg-1704565200000` | `reg-1704565200000-a1b2c3d4` |

## 迁移选项

### 选项1：保持现状（推荐）
- 旧ID继续正常工作
- 新创建的数据使用新格式
- 无需任何操作

### 选项2：手动迁移特定数据
如果您想迁移特定的session：
1. 在管理面板中删除旧session
2. 重新创建相同的session（会自动使用新ID格式）
3. 用户需要重新报名

### 选项3：批量迁移（需要添加功能）
如果需要批量迁移，可以在AdminPanel中添加迁移按钮：

```typescript
// 在 AdminPanel.tsx 中添加
import { migrateSessionIds, migrateRegistrationIds, createIdMapping } from '../utils/migrateIds';

const handleMigrateIds = async () => {
  if (!confirm('确定要迁移所有旧格式ID吗？此操作不可撤销。')) return;
  
  const sessions = await fetchSessions();
  const registrations = await fetchRegistrations();
  
  // 迁移session和class IDs
  const migratedSessions = migrateSessionIds(sessions);
  
  // 创建ID映射
  const idMapping = createIdMapping(sessions, migratedSessions);
  
  // 迁移registration IDs并更新引用
  const migratedRegistrations = migrateRegistrationIds(registrations, idMapping);
  
  // 保存到JSONBin
  await updateSessions(migratedSessions);
  await updateBin(REGISTRATIONS_BIN_ID, migratedRegistrations);
  
  alert('ID迁移完成！');
  loadSessions();
};
```

## 注意事项

1. **迁移前请备份数据**
2. **迁移会改变所有ID**，可能影响：
   - 用户的报名记录关联
   - 外部系统的引用
   - URL中的ID参数
3. **建议在用户较少的时间进行迁移**

## 结论

大多数情况下，**不需要迁移旧ID**。混合使用新旧格式ID不会影响系统功能。
