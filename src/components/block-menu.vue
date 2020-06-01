<template>
  <div class="block-menu">
    <div class="menu-list">
      <div v-for="i in menuArr" :key="i.id" class="menu-item" @mouseenter="menuEnter($event, i)"
          @mouseleave="menuleave($event, i)" @click="menuClick(i)">
        <div class="menu-content">
          <img :src="i.icon" alt="">
          <p>{{ i.title }}</p>
        </div>
        <div class="hover-list" v-if="i.children && i.children.length !== 0">
          <div v-for="item in i.children" :key="item.itemId" @click.stop="itemClick(item)">
            <img :src="item.icon" alt="" v-if="item.icon">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'block-menu',
  props: {
    menuArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    menuEnter (e, i) {
      e.target.children[1].style.display = 'block'
    },
    menuleave (e, i) {
      e.target.children[1].style.display = 'none'
    },
    menuClick (i) {
      this.$emit('menuClick', i)
    },
    itemClick (i) {
      this.$emit('itemClick', i)
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-list {
  .menu-item {
    background: rgba(0, 0, 0, .6);
    color: white;
    font-size: 0.6em;
    text-align: center;
    padding: .65em;
    cursor: pointer;
    position: relative;
    & > img {
      margin: .35em 0;
    }
    .hover-list {
      display: none;
      color: black;
      position: absolute;
      top: 2px;
      left: 86px;
      width: 400px;
      & > div {
        width: 70px;
        float: left;
        display: inline-block;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 0.4em .4em;
      }
    }
  }
  .menu-item + .menu-item {
    border-top: 1px solid white;
  }
  .menu-item:hover {
    background: rgb(28,109,200);
  }
  .menu-content:hover ::before{
    content: " ";
    width: 4px;
    height: 100%;
    display: inline-block;
    background: rgb(28,109,200);
    position: absolute;
    top: 0;
    left: -8px;
  }
  .hover-item {

  }
}
</style>
