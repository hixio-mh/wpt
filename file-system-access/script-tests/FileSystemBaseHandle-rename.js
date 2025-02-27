// META: script=resources/test-helpers.js

'use strict';

directory_test(async (t, root) => {
  const handle = await createFileWithContents(t, 'file-before', 'foo', root);
  await handle.rename('file-after');

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-after']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename(name) to rename a file');

directory_test(async (t, root) => {
  const handle = await createFileWithContents(t, 'file-before', 'foo', root);
  await handle.rename('file-before');

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-before']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename(name) to rename a file the same name');

directory_test(async (t, root) => {
  const handle = await createFileWithContents(t, 'file-before', 'foo', root);
  await promise_rejects_js(t, TypeError, handle.rename(''));

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-before']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename("") to rename a file fails');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-before', {create: true});
  await dir.rename('dir-after');

  assert_array_equals(await getSortedDirectoryEntries(root), ['dir-after/']);
  assert_array_equals(await getSortedDirectoryEntries(dir), []);
}, 'rename(name) to rename an empty directory');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-before', {create: true});
  await promise_rejects_js(t, TypeError, dir.rename(''));

  assert_array_equals(await getSortedDirectoryEntries(root), ['dir-before/']);
  assert_array_equals(await getSortedDirectoryEntries(dir), []);
}, 'rename("") to rename an empty directory fails');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir-before', {create: true});
  await createFileWithContents(t, 'file-in-dir', 'abc', dir);
  await dir.rename('dir-after');

  assert_array_equals(await getSortedDirectoryEntries(root), ['dir-after/']);
  assert_array_equals(await getSortedDirectoryEntries(dir), ['file-in-dir']);
}, 'rename(name) to rename a non-empty directory');

directory_test(async (t, root) => {
  const handle = await createFileWithContents(t, 'file-1', 'foo', root);

  await handle.rename('file-2');
  assert_array_equals(await getSortedDirectoryEntries(root), ['file-2']);

  await handle.rename('file-3');
  assert_array_equals(await getSortedDirectoryEntries(root), ['file-3']);

  await handle.rename('file-1');
  assert_array_equals(await getSortedDirectoryEntries(root), ['file-1']);
}, 'rename(name) can be called multiple times');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir', {create: true});
  const handle = await createFileWithContents(t, 'file-before', 'foo', dir);
  await handle.rename(root);

  assert_array_equals(await getSortedDirectoryEntries(root), ['dir/']);
  assert_array_equals(
      await getSortedDirectoryEntries(dir),
      ['[object FileSystemDirectoryHandle]']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename(dir) should rename to stringified dir object');

directory_test(async (t, root) => {
  const dir = await root.getDirectoryHandle('dir', {create: true});
  const handle = await createFileWithContents(t, 'file-before', 'foo', dir);
  await promise_rejects_js(t, TypeError, handle.rename('Lorem.'));

  assert_array_equals(await getSortedDirectoryEntries(root), ['dir/']);
  assert_array_equals(await getSortedDirectoryEntries(dir), ['file-before']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename(name) with a name with a trailing period should fail');

directory_test(async (t, root) => {
  const handle = await createFileWithContents(t, 'file-before', 'foo', root);
  await promise_rejects_js(t, TypeError, handle.rename('#$23423@352^*3243'));

  assert_array_equals(await getSortedDirectoryEntries(root), ['file-before']);
  assert_equals(await getFileContents(handle), 'foo');
  assert_equals(await getFileSize(handle), 3);
}, 'rename(name) with a name with invalid characters should fail');
